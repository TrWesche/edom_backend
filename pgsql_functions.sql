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
			sitegroups.id AS context
		FROM grouppermissions
		LEFT JOIN grouproles_grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
		LEFT JOIN grouproles ON grouproles.id = grouproles_grouppermissions.grouprole_id
		LEFT JOIN sitegroups ON sitegroups.id = grouproles.group_id
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
	FROM useraccount
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
	WHERE useraccount.id = UserID AND sitepermissions.name IN (SELECT unnest(PermList));
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
	LEFT JOIN sitegroups ON sitegroups.id = group_equipment.group_id
	LEFT JOIN grouproles ON grouproles.group_id = sitegroups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN useraccount ON useraccount.id = user_grouproles.user_id
	LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
	WHERE useraccount.id = UserID AND equipment.id = EquipmentID AND grouppermissions.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT DISTINCT
		sitepermissions.name AS permissions_name
	FROM equipment
	LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
	LEFT JOIN useraccount ON useraccount.id = user_equipment.user_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
	WHERE useraccount.id = UserID AND equipment.id = EquipmentID AND sitepermissions.name IN (SELECT unnest(UserPermList))
   	UNION
	SELECT * FROM retrieve_user_auth_for_public_equipment(UserID, EquipmentID, PublicPermList);
END;
$BODY$
LANGUAGE plpgsql;



-- Filter out Public / Site Wide permissions for room which is not marked as public
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_public_room (UserID uuid, RoomID uuid, PermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	IF (SELECT rooms.public FROM rooms WHERE rooms.id=RoomID) THEN
		RETURN QUERY SELECT * FROM retrieve_user_public_authorization(UserID, PermList);
	END IF;
END;
$BODY$
LANGUAGE plpgsql;


-- Retrieve All User Authorizations for a target room
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_room (UserID uuid, RoomID uuid, GroupPermList text[], UserPermList text[], PublicPermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		grouppermissions.name AS permissions_name
	FROM rooms
	LEFT JOIN group_rooms ON group_rooms.room_id = rooms.id
	LEFT JOIN sitegroups ON sitegroups.id = group_rooms.group_id
	LEFT JOIN grouproles ON grouproles.group_id = sitegroups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN useraccount ON useraccount.id = user_grouproles.user_id
	LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
	WHERE useraccount.id = UserID AND rooms.id = RoomID AND grouppermissions.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT DISTINCT
		sitepermissions.name AS permissions_name
	FROM rooms
	LEFT JOIN user_rooms ON user_rooms.room_id = rooms.id 
	LEFT JOIN useraccount ON useraccount.id = user_rooms.user_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
	WHERE useraccount.id = UserID AND rooms.id = RoomID AND sitepermissions.name IN (SELECT unnest(UserPermList))
   	UNION
	SELECT * FROM retrieve_user_auth_for_public_room(UserID, RoomID, PublicPermList);
END;
$BODY$
LANGUAGE plpgsql;



-- Filter out Public / Site Wide permissions for group which is not marked as public
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_public_group (UserID uuid, GroupID uuid, PermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	IF (SELECT sitegroups.public FROM sitegroups WHERE sitegroups.id=GroupID) THEN
		RETURN QUERY SELECT * FROM retrieve_user_public_authorization(UserID, PermList);
	END IF;
END;
$BODY$
LANGUAGE plpgsql;


-- Retrieve All User Authorizations for a target group
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_group(UserID uuid, GroupID uuid, GroupPermList text[], PublicPermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		grouppermissions.name AS permissions_name
	FROM sitegroups
	LEFT JOIN grouproles ON grouproles.group_id = sitegroups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN useraccount ON useraccount.id = user_grouproles.user_id
	LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
	WHERE useraccount.id = UserID AND sitegroups.id = GroupID AND grouppermissions.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT * FROM retrieve_user_auth_for_public_group(UserID, GroupID, PublicPermList);
END;
$BODY$
LANGUAGE plpgsql;


-- TODO: Need to validate these functions

-- Filter out Public / Site Wide permissions for user which is not marked as public
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_public_user (UserID uuid, PermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	IF (SELECT userprofile.public FROM userprofile WHERE userprofile.id=UserID) THEN
		RETURN QUERY SELECT * FROM retrieve_user_public_authorization(UserID, PermList);
	END IF;
END;
$BODY$
LANGUAGE plpgsql;


-- Retrieve All User Authorizations for a target group
CREATE OR REPLACE FUNCTION retrieve_user_auth_for_user(UserID uuid, UserPermList text[], PublicPermList text[])
RETURNS TABLE (
	permissions_name text
)
AS 
$BODY$
DECLARE
BEGIN
	SELECT DISTINCT
		sitepermissions.name AS permissions_name
	FROM userprofile
	LEFT JOIN useraccount ON useraccount.id = userprofile.account_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
	WHERE useraccount.id = UserID AND rooms.id = RoomID AND sitepermissions.name IN (SELECT unnest(UserPermList))
	UNION
	SELECT * FROM retrieve_user_auth_for_public_user(UserID, PublicPermList);
END;
$BODY$
LANGUAGE plpgsql;


-- Create New User
CREATE OR REPLACE FUNCTION create_user_account (
	_username text, 
	_password text, 
	_email text, 
	_first_name text DEFAULT null, 
	_last_name text DEFAULT null
)
RETURNS TABLE (
	id uuid,
	username text
) 
AS 
$BODY$
DECLARE
	_id uuid;
	_userrole_id uuid;
BEGIN
	INSERT INTO useraccount
		("password", "account_status")
	VALUES
		(_password, 'active')
	RETURNING useraccount.id
	INTO _id;
	
	INSERT INTO userdata
		("account_id", "email", "public_email", "first_name", "public_first_name", "last_name", "public_last_name")
	VALUES
		(_id, _email, FALSE, _first_name, FALSE, _last_name, FALSE);
		
	INSERT INTO userprofile
		("account_id", "username")
	VALUES
		(_id, _username);
		
	SELECT siteroles.id INTO _userrole_id FROM siteroles WHERE name = 'user';
	
	INSERT INTO user_siteroles
		(user_id, siterole_id)
	VALUES
		(_id, _userrole_id);
	
	RETURN QUERY SELECT 
		useraccount.id AS id, 
		userprofile.username AS username 
	FROM useraccount 
	LEFT JOIN userprofile on useraccount.id = userprofile.account_id;
END;
$BODY$
LANGUAGE plpgsql;