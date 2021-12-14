import ExpressError from "../utils/expresError";
import pgdb from "../databases/postgreSQL/pgdb";
import { GroupPermObjectProps } from "./groupPerm.repository";

export interface GroupRolePermsProps {
    role_id?: string,
    permission_id?: string
}




class GroupRolePermsRepo {
    static async create_new_group_role_perm(groupRoleID: string, groupPermList: Array<GroupPermObjectProps>) {
        const valueExpressions: Array<string> = [];
        let queryValues = [groupRoleID];
    
        for (const permission of groupPermList) {
            if (permission.id) {
                queryValues.push(permission.id);
                valueExpressions.push(`($1, $${queryValues.length})`)
            }
        }
    
        const valueExpressionRows = valueExpressions.join(",");
    
        try {
            const result = await pgdb.query(`
                INSERT INTO groupRole_groupPermissions
                    (role_id, permission_id)
                VALUES
                    ${valueExpressionRows}
                RETURNING role_id, permission_id`,
            queryValues);
            
            const rval: Array<GroupRolePermsProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group role permission(s) - ${error}`, 500);
        };
    };
    

    static async fetch_group_role_perms_by_group_role_id(groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT groupRoles.id AS role_id,
                        groupRoles.name AS role_name,
                        groupPermissions.id AS permission_id,
                        groupPermissions.name AS permission_name
                  FROM groupRoles
                  LEFT JOIN groupRole_groupPermissions AS joinTable
                  ON groupRoles.id = groupRole_groupPermissions.role_id
                  LEFT JOIN groupPermissions
                  ON joinTable.permission_id = groupPermissions.id
                  WHERE role_id = $1`,
                  [groupRoleID]
            );
    
            const rval = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group role permissions - ${error}`, 500);
        };
    };
    
    
    static async delete_group_role_perm_by_role_id_and_perm_id(groupRoleID: string, groupPermID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRole_groupPermissions
                WHERE role_id = $1 AND permission_id = $2
                RETURNING role_id`,
            [groupRoleID, groupPermID]);
    
            const rval: GroupRolePermsProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error}`, 500);
        }
    };
}


export default GroupRolePermsRepo;