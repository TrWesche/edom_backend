import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface GroupRoleProps {
    id?: string,
    group_id?: string,
    name?: string
}


export interface GroupPermProps {
    id?: string,
    name?: string
}


export interface GroupRolePermsProps {
    role_id?: string,
    permission_id?: string
}


class GroupPermissionsRepo {
    // ROLE Management
    static async create_new_role(groupRoleData: GroupRoleProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO groupRoles
                    (name, group_id) 
                VALUES ($1, $2) 
                RETURNING id, name, group_id`,
            [
                groupRoleData.name,
                groupRoleData.group_id
            ]);
            
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group role - ${error}`, 500);
        }
    }; 

    static async fetch_roles_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name,
                        group_id 
                  FROM groupRoles
                  WHERE group_id = $1`,
                  [groupID]
            );

            const rval: Array<GroupRoleProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get roles for the target group - ${error}`, 500);
        }
    };

    static async fetch_role_by_role_id(groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name,
                        group_id
                  FROM groupRoles
                  WHERE id = $1`,
                  [groupRoleID]
            );
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group role - ${error}`, 500);
        };
    };

    static async fetch_role_by_role_name(groupRoleName: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name,
                        group_id
                  FROM groupRoles
                  WHERE name = $1`,
                  [groupRoleName]
            );
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group role - ${error}`, 500);
        };
    };

    static async update_role_by_role_id(groupRoleID: string, groupRoleData: GroupRoleProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "groupRoles",
                groupRoleData,
                "id",
                groupRoleID
            );
    
            const result = await pgdb.query(query, values);

            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update group role - ${error}`, 500);
        }
    };
    
    static async delete_role_by_role_id(groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRoles
                WHERE id = $1
                RETURNING id`,
            [groupRoleID]);
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role - ${error}`, 500);
        }
    };

    // User Role Management
    static async create_user_group_role(userID: string, groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO user_grouproles
                    (user_id, grouprole_id) 
                VALUES ($1, $2) 
                RETURNING user_id, grouprole_id`,
            [
                userID, groupRoleID
            ]);

            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to assign user group role - ${error}`, 500);
        }
    };

    static async delete_user_group_roles_all(userID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_grouproles
                WHERE user_id = $1`,
                [userID]
            );

            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user group roles - ${error}`, 500);
        }
    };

    static async delete_user_group_role_by_role_id(userID: string, roleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_grouproles
                WHERE user_id = $1 AND group_roleid = $2`,
                [userID, roleID]
            );

            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user group role - ${error}`, 500);
        }
    };

    static async fetch_group_roles_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(
                `SELECT users.id AS user_id,
                        users.username AS username,
                        groupRoles.id AS role_id, 
                        groupRoles.name AS role_name
                    FROM users
                    LEFT JOIN user_groupRoles 
                        ON users.id = user_groupRoles.user_id
                    LEFT JOIN groupRoles
                        ON user_groupRoles.role_id = groupRoles.id
                    WHERE user_id = $1`,
                    [userID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site group for the target user - ${error}`, 500);
        }
    };

    static async fetch_group_permissions_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(
                `SELECT DISTINCT
                        groupPermissions.id AS permission_id,
                        groupPermissions.name AS permission_name,
                    FROM groupPermissions
                    LEFT JOIN groupRole_groupPermissions
                        ON groupRole_groupPermissions.permission_id = groupPermissiosn.id
                    LEFT JOIN user_groupRoles
                        ON user_groupRoles.role_id = groupRole_groupPermissions.role_id
                    WHERE user_groupRoles.user_id = $1`,
                    [userID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site roles for the target user - ${error}`, 500);
        }  
    };


    // PERMISSIONS Management
    static async create_new_permission(groupPermData: GroupPermProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO groupPermissions
                    (name) 
                VALUES ($1) 
                RETURNING id, name`,
            [
                groupPermData.name,
            ]);
            
            const rval: GroupPermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group permission - ${error}`, 500);
        }
    };

    static async fetch_permission_by_permission_id(groupPermID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM groupPermissions
                  WHERE id = $1`,
                  [groupPermID]
            );
    
            const rval: GroupPermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group permission - ${error}`, 500);
        };
    };

    static async update_permission_by_permission_id(groupPermID: string, groupPermData: GroupPermProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "groupPermissions",
                groupPermData,
                "id",
                groupPermID
            );
    
            const result = await pgdb.query(query, values);

            const rval: GroupPermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update group permission - ${error}`, 500);
        }
    };
    
    static async delete_permission_by_permission_id(groupPermID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupPermissions
                WHERE id = $1
                RETURNING id`,
            [groupPermID]);
    
            const rval: GroupPermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group permission - ${error}`, 500);
        }
    }; 


    // ROLE PERMISSIONS ASSOCIATIONS Management
    static async create_role_permissions(groupRoleID: string, permissionList: Array<string>) {
        const valueExpressions: Array<string> = [];
        let queryValues = [groupRoleID];
    
        for (const permission of permissionList) {
            if (permission) {
                queryValues.push(permission);
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

    static async fetch_role_permissions_by_role_id(groupRoleID: string) {
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
    
    static async delete_role_permissions_by_role_permission_ids(groupRoleID: string, groupPermID: string) {
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


export default GroupPermissionsRepo;