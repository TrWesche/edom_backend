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



CREATE OR REPLACE FUNCTION get_permission_uuid (permission_name text) 
RETURNS uuid AS $permission_id$
DECLARE
	permission_id uuid;
BEGIN
	SELECT permissiontypes.id INTO permission_id FROM permissiontypes WHERE permissiontypes.name = permission_name;
	RETURN permission_id;
END;
$permission_id$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_user_permissions (search_uid uuid) 
RETURNS TABLE (permission_name text, context uuid) AS $BODY$
BEGIN
	RETURN QUERY 
		SELECT DISTINCT 
			permissiontypes.name AS permission_name,
			uuid_nil() AS context
		FROM permissiontypes 
		LEFT JOIN siterole_permissiontypes ON permissiontypes.id = siterole_permissiontypes.permission_id
		LEFT JOIN user_siteroles ON siterole_permissiontypes.siterole_id = user_siteroles.siterole_id
		WHERE user_siteroles.user_id = search_uid
		UNION
		SELECT DISTINCT
			permissiontypes.name AS permission_name,
			sitegroups.id AS context
		FROM permissiontypes
		LEFT JOIN grouproles_permissiontypes ON permissiontypes.id = grouproles_permissiontypes.permission_id
		LEFT JOIN grouproles ON grouproles.id = grouproles_permissiontypes.grouprole_id
		LEFT JOIN sitegroups ON sitegroups.id = grouproles.group_id
		LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles_permissiontypes.grouprole_id
		WHERE user_grouproles.user_id = search_uid;
END;
$BODY$ LANGUAGE plpgsql;


-- Retrieve Public / Site Wide User Authorizations
-- FUNCTION: public.retrieve_user_public_authorization(uuid, text[])

-- DROP FUNCTION IF EXISTS public.retrieve_user_public_authorization(uuid, text[]);

CREATE OR REPLACE FUNCTION public.retrieve_user_public_authorization(
	userid uuid,
	permlist text[])
    RETURNS TABLE(permissions_name text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		permissiontypes.name AS permissions_name
	FROM useraccount
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_permissiontypes ON siterole_permissiontypes.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN permissiontypes ON permissiontypes.id = siterole_permissiontypes.permission_id 
	WHERE useraccount.id = UserID AND siteroles.name = 'public' AND permissiontypes.name IN (SELECT unnest(PermList));
END;
$BODY$;


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
-- FUNCTION: public.retrieve_user_auth_for_equipment(uuid, uuid, text[], text[], text[])

-- DROP FUNCTION IF EXISTS public.retrieve_user_auth_for_equipment(uuid, uuid, text[], text[], text[]);

CREATE OR REPLACE FUNCTION public.retrieve_user_auth_for_equipment(
	userid uuid,
	equipmentid uuid,
	grouppermlist text[],
	userpermlist text[],
	publicpermlist text[])
    RETURNS TABLE(permissions_name text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		permissiontypes.name AS permissions_name
	FROM equipment
	LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
	LEFT JOIN sitegroups ON sitegroups.id = group_equipment.group_id
	LEFT JOIN grouproles ON grouproles.group_id = sitegroups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN useraccount ON useraccount.id = user_grouproles.user_id
	LEFT JOIN grouproles_permissiontypes ON grouproles_permissiontypes.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN permissiontypes ON permissiontypes.id = grouproles_permissiontypes.permission_id
	WHERE useraccount.id = UserID AND equipment.id = EquipmentID AND permissiontypes.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT DISTINCT
		permissiontypes.name AS permissions_name
	FROM equipment
	LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
	LEFT JOIN useraccount ON useraccount.id = user_equipment.user_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_permissiontypes ON siterole_permissiontypes.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN permissiontypes ON permissiontypes.id = siterole_permissiontypes.permission_id 
	WHERE useraccount.id = UserID AND equipment.id = EquipmentID AND siteroles.name = 'user' AND permissiontypes.name IN (SELECT unnest(UserPermList))
   	UNION
	SELECT * FROM retrieve_user_auth_for_public_equipment(UserID, EquipmentID, PublicPermList);
END;
$BODY$;


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
		permissiontypes.name AS permissions_name
	FROM rooms
	LEFT JOIN group_rooms ON group_rooms.room_id = rooms.id
	LEFT JOIN sitegroups ON sitegroups.id = group_rooms.group_id
	LEFT JOIN grouproles ON grouproles.group_id = sitegroups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN useraccount ON useraccount.id = user_grouproles.user_id
	LEFT JOIN grouproles_permissiontypes ON grouproles_permissiontypes.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN permissiontypes ON permissiontypes.id = grouproles_permissiontypes.permission_id
	WHERE useraccount.id = UserID AND rooms.id = RoomID AND permissiontypes.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT DISTINCT
		permissiontypes.name AS permissions_name
	FROM rooms
	LEFT JOIN user_rooms ON user_rooms.room_id = rooms.id 
	LEFT JOIN useraccount ON useraccount.id = user_rooms.user_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_permissiontypes ON siterole_permissiontypes.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN permissiontypes ON permissiontypes.id = siterole_permissiontypes.permission_id 
	WHERE useraccount.id = UserID AND rooms.id = RoomID AND permissiontypes.name IN (SELECT unnest(UserPermList))
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
		permissiontypes.name AS permissions_name
	FROM sitegroups
	LEFT JOIN grouproles ON grouproles.group_id = sitegroups.id
	LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
	LEFT JOIN useraccount ON useraccount.id = user_grouproles.user_id
	LEFT JOIN grouproles_permissiontypes ON grouproles_permissiontypes.grouprole_id = user_grouproles.grouprole_id
	LEFT JOIN permissiontypes ON permissiontypes.id = grouproles_permissiontypes.permission_id
	WHERE useraccount.id = UserID AND sitegroups.id = GroupID AND permissiontypes.name IN (SELECT unnest(GroupPermList))
	UNION
	SELECT * FROM retrieve_user_auth_for_public_group(UserID, GroupID, PublicPermList);
END;
$BODY$
LANGUAGE plpgsql;


-- Filter out Public / Site Wide permissions for user which is not marked as public
-- FUNCTION: public.retrieve_user_auth_for_public_user(uuid, text[])

-- DROP FUNCTION IF EXISTS public.retrieve_user_auth_for_public_user(uuid, text[]);

CREATE OR REPLACE FUNCTION public.retrieve_user_auth_for_public_user(
	userid uuid,
	permlist text[])
    RETURNS TABLE(permissions_name text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
BEGIN
	IF (SELECT userprofile.public FROM userprofile WHERE userprofile.user_id=UserID) THEN
		RETURN QUERY SELECT * FROM retrieve_user_public_authorization(UserID, PermList);
	END IF;
END;
$BODY$;


-- Retrieve All User Authorizations for a target group
-- FUNCTION: public.retrieve_user_auth_for_user(uuid, text[], text[])

-- DROP FUNCTION IF EXISTS public.retrieve_user_auth_for_user(uuid, text[], text[]);

CREATE OR REPLACE FUNCTION public.retrieve_user_auth_for_user(
	_userid uuid,
	_userpermlist text[],
	_publicpermlist text[])
    RETURNS TABLE(permissions_name text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
BEGIN
	RETURN QUERY SELECT DISTINCT
		permissiontypes.name AS permissions_name
	FROM userprofile
	LEFT JOIN useraccount ON useraccount.id = userprofile.user_id
	LEFT JOIN user_siteroles ON user_siteroles.user_id = useraccount.id 
	LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
	LEFT JOIN siterole_permissiontypes ON siterole_permissiontypes.siterole_id = user_siteroles.siterole_id 
	LEFT JOIN permissiontypes ON permissiontypes.id = siterole_permissiontypes.permission_id 
	WHERE useraccount.id = _userid AND siteroles.name = 'user' AND permissiontypes.name IN (SELECT unnest(_userpermlist))
	UNION
	SELECT * FROM retrieve_user_auth_for_public_user(_userid, _publicpermlist);
END;
$BODY$;


-- Create New User
-- FUNCTION: public.create_user_account(text, text, text, text, text)

-- DROP FUNCTION IF EXISTS public.create_user_account(text, text, text, text, text);
CREATE OR REPLACE FUNCTION public.create_user_account(
	_username text,
	_password text,
	_email text,
	_first_name text DEFAULT NULL::text,
	_last_name text DEFAULT NULL::text)
    RETURNS TABLE(id uuid, username text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
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
		("user_id", "email", "public_email", "first_name", "public_first_name", "last_name", "public_last_name")
	VALUES
		(_id, _email, FALSE, _first_name, FALSE, _last_name, FALSE);
		
	INSERT INTO userprofile
		("user_id", "username")
	VALUES
		(_id, _username);
		
	SELECT siteroles.id INTO _userrole_id FROM siteroles WHERE name = 'user';
	
	INSERT INTO user_siteroles
		(user_id, siterole_id)
	VALUES
		(_id, _userrole_id);
	
	
	SELECT siteroles.id INTO _userrole_id FROM siteroles WHERE name = 'public';
	
	INSERT INTO user_siteroles
		(user_id, siterole_id)
	VALUES
		(_id, _userrole_id);
	
	RETURN QUERY SELECT 
		useraccount.id AS id, 
		userprofile.username AS username 
	FROM useraccount 
	LEFT JOIN userprofile on useraccount.id = userprofile.user_id;
END;
$BODY$;



-- Delete User Account
-- FUNCTION: public.delete_user_account(uuid)

-- DROP FUNCTION IF EXISTS public.delete_user_account(uuid);

CREATE OR REPLACE FUNCTION public.delete_user_account(
	_user_id uuid)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	funcresult text;
BEGIN
	DELETE FROM user_siteroles
	WHERE user_siteroles.user_id = _user_id;
	
	DELETE FROM userprofile
	WHERE userprofile.user_id = _user_id;
	
	DELETE FROM userdata
	WHERE userdata.user_id = _user_id;
	
	DELETE FROM useraccount
	WHERE useraccount.id = _user_id;
	
	RETURN 'success';
END;
$BODY$;