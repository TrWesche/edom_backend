CREATE OR REPLACE FUNCTION get_site_role_uuid (role_name text) 
RETURNS uuid AS $siterole_id$
DECLARE
	siterole_id uuid;
BEGIN
	SELECT siteroles.id INTO siterole_id FROM siteroles WHERE siteroles.name = role_name;
	RETURN siterole_id;
END;
$siterole_id$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_group_role_uuid (role_name text, group_id_var uuid) 
RETURNS uuid AS $grouprole_id$
DECLARE
	grouprole_id uuid;
BEGIN
	SELECT grouproles.id INTO grouprole_id FROM grouproles WHERE grouproles.name = role_name AND grouproles.group_id = group_id_var;
	RETURN grouprole_id;
END;
$grouprole_id$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_group_permission_uuid (permission_name text) 
RETURNS uuid AS $grouppermission_id$
DECLARE
	grouppermission_id uuid;
BEGIN
	SELECT grouppermissions.id INTO grouppermission_id FROM grouppermissions WHERE grouppermissions.name = permission_name;
	RETURN grouppermission_id;
END;
$grouppermission_id$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_user_permissions (search_uid uuid) 
RETURNS TABLE (permission_name text, context uuid) AS $BODY$
BEGIN
	RETURN QUERY 
		SELECT DISTINCT 
			sitepermissions.name AS permission_name,
			uuid_nil() AS context
		FROM sitepermissions 
		LEFT JOIN siterole_sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id
		LEFT JOIN user_siteroles ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id
		WHERE user_siteroles.user_id = search_uid
		UNION
		SELECT DISTINCT
			grouppermissions.name AS permission_name,
			groups.id AS context
		FROM grouppermissions
		LEFT JOIN grouproles_grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
		LEFT JOIN grouproles ON grouproles.id = grouproles_grouppermissions.grouprole_id
		LEFT JOIN groups ON groups.id = grouproles.group_id
		LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles_grouppermissions.grouprole_id
		WHERE user_grouproles.user_id = search_uid;
END;
$BODY$ LANGUAGE plpgsql;


-- Retrieve Public / Site Wide User Authorizations
CREATE OR REPLACE FUNCTION retrieve_user_public_authorization (UserID uuid, PermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		sitepermissions.name AS permissions_name
	FROM users
	LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
	WHERE users.id = UserID AND sitepermissions.name IN (SELECT unnest(PermList));
END;
$BODY$
LANGUAGE plpgsql;


-- Filter out Public / Site Wide permissions for equipment which is not marked as public
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_public_equipment (UserID uuid, EquipmentID uuid, PermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	IF (SELECT equipment.public FROM equipment WHERE equipment.id=EquipmentID) THEN
		RETURN QUERY SELECT * FROM retrieve_user_public_authorization(UserID, PermList);
	END IF;
END;
$BODY$
LANGUAGE plpgsql;


-- Retrieve All User Authorizations for a target piece of equipment
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_equipment (UserID uuid, EquipmentID uuid, GroupPermList text[], UserPermList text[], PublicPermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		grouppermissions.name AS permissions_name
	FROM equipment
	LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
	LEFT JOIN groups ON groups.id = group_equipment.group_id
	LEFT JOIN grouproles ON grouproles.group_id = groups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN users ON users.id = user_grouproles.user_id
	LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
	WHERE users.id = UserID AND equipment.id = EquipmentID AND grouppermissions.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT DISTINCT
		sitepermissions.name AS permissions_name
	FROM equipment
	LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
	LEFT JOIN users ON users.id = user_equipment.user_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
	WHERE users.id = UserID AND equipment.id = EquipmentID AND sitepermissions.name IN (SELECT unnest(UserPermList))
   	UNION
	SELECT * FROM retrieve_user_auth_for_public_equipment(UserID, EquipmentID, PublicPermList);
END;
$BODY$
LANGUAGE plpgsql;