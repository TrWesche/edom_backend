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
    grouprole_id?: string,
    grouppermission_id?: string
}

export interface GroupUserRoleProps {
    user_id?: string,
    grouprole_id?: string
}

class GroupPermissionsRepo {
    // ROLE Management
    static async create_role(groupRoleData: GroupRoleProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO grouproles
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

    static async create_roles_init_new_group(groupID: string) {
        try {
            const newGroupRoles = ["owner", "admin", "manage_room", "manage_equip", "user"];
            const queryColumns: Array<string> = ["name", "group_id"];
            const queryColIdxs: Array<string> = [];
            const queryParams: Array<any> = [];
            
            let idx = 1;
            newGroupRoles.forEach((val) => {
                queryColIdxs.push(`($${idx}, $${idx+1})`);
                queryParams.push(val, groupID);
                idx += 2;
            });

            const query = `
                INSERT INTO grouproles 
                    (${queryColumns.join(",")}) 
                VALUES ${queryColIdxs.join(",")} 
                RETURNING id, name, group_id`;

            const result = await pgdb.query(query, queryParams);
            
            const rval: Array<GroupRoleProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create roles for new group - ${error}`, 500);
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

    static async fetch_role_by_role_name(groupID: string, groupRoleName: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name,
                        group_id
                  FROM groupRoles
                  WHERE name = $1 AND group_id = $2`,
                  [groupRoleName, groupID]
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

    static async delete_roles_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRoles
                WHERE group_id = $1
                RETURNING id`,
            [groupID]);
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group roles - ${error}`, 500);
        }
    };


    // PERMISSIONS Management
    static async create_permission(groupPermData: GroupPermProps) {
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

    static async create_role_permissions_for_new_group(groupID: string) {
        try {
            const newGroupPermissions = {
                owner: [
                    'create_role', 'read_role', 'update_role', 'delete_role',
                    'create_user_role', 'read_user_role', 'delete_user_role',
                    'create_group_user', 'read_group_user', 'delete_group_user',
                    'create_equip', 'read_equip', 'update_equip', 'delete_equip',
                    'create_room', 'read_room', 'update_room', 'delete_room'
                ],
                admin: [
                    'read_role',
                    'create_user_role', 'read_user_role', 'delete_user_role',
                    'create_group_user', 'read_group_user', 'delete_group_user',
                    'create_equip', 'read_equip', 'update_equip', 'delete_equip',
                    'create_room', 'read_room', 'update_room', 'delete_room'
                ],
                manage_room: [
                    'create_room', 'read_room', 'update_room', 'delete_room'
                ],
                manage_equip: [
                    'create_equip', 'read_equip', 'update_equip', 'delete_equip'
                ],
                user: [
                    'read_group_user', 'read_equip', 'read_room'
                ]
            };

            const queryColumns: Array<string> = ["grouprole_id", "grouppermission_id"];
            const queryColIdxs: Array<string> = [];
            const queryParams: Array<any> = [];
            
            let idx = 1;
            // If this works its super inefficient and should be replaced at some point
            for (const key in newGroupPermissions) {
                newGroupPermissions[key].forEach(element => {
                    queryColIdxs.push(`
                    (SELECT get_group_role_uuid($${idx}, $${idx+1}), SELECT get_group_permission_uuid($${idx+2}))`);
                    queryParams.push(key, groupID, element);
                    idx += 3;
                });
            };

            const query = `
                INSERT INTO grouproles_grouppermissions
                    (${queryColumns.join(",")}) 
                VALUES ${queryColIdxs.join(",")} 
                RETURNING grouprole_id, grouppermission_id`;

            const result = await pgdb.query(query, queryParams);
            
            const rval: Array<GroupRoleProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create role permissions for new group - ${error}`, 500);
        }
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

    static async delete_role_permission_by_role_permission_id(groupRoleID: string, groupPermID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRole_groupPermissions
                WHERE grouprole_id = $1 AND grouppermission_id = $2
                RETURNING grouprole_id`,
            [groupRoleID, groupPermID]);

            const rval: GroupRolePermsProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error}`, 500);
        }
    };

    static async delete_role_permissions_by_role_id(groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRole_groupPermissions
                WHERE grouprole_id = $1
                RETURNING grouprole_id`,
            [groupRoleID]);

            const rval: GroupRolePermsProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error}`, 500);
        }
    };

    static async delete_role_permissions_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groupRole_groupPermissions
                WHERE grouprole_id IN 
                (
                    SELECT grouproles.id FROM grouproles
                    WHERE grouproles.group_id = $1
                )
                RETURNING grouprole_id`,
                [groupID]
            ); 

            const rval: GroupRolePermsProps | undefined = result.rows[0];
            return rval;    
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error.message}`, 500);
        }   
    };


    // User Role Management
    static async create_user_group_role_by_role_id(userID: string, groupRoleID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO user_grouproles
                    (user_id, grouprole_id) 
                VALUES ($1, $2) 
                RETURNING user_id, grouprole_id`,
            [
                userID, groupRoleID
            ]);

            const rval: GroupUserRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to assign user group role - ${error}`, 500);
        }
    };

    static async delete_user_group_roles_by_user_id(userID: string) {
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

    static async delete_user_group_role_by_user_and_role_id(userID: string, roleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_grouproles
                WHERE user_id = $1 AND grouprole_id = $2
                RETURNING user_id, grouprole_id`,
                [userID, roleID]
            );

            const rval: GroupUserRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user group role - ${error}`, 500);
        }
    };

    static async delete_user_group_roles_by_role_id(roleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_grouproles
                WHERE grouprole_id = $1
                RETURNING user_id, grouprole_id`,
                [roleID]
            );

            const rval: GroupUserRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user role associations - ${error}`, 500);
        }
    };

    static async fetch_user_group_roles_by_user_id(userID: string, groupID: string) {
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
                    WHERE users.id = $1 AND groupRoles.group_id = $2`,
                    [userID, groupID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site group for the target user - ${error}`, 500);
        }
    };

    static async fetch_user_group_permissions_by_user_id(userID: string) {
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
}


export default GroupPermissionsRepo;