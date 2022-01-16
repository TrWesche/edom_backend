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