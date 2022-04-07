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

interface IDList {
    id?: string
};

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
                  FROM grouproles
                  WHERE group_id = $1`,
                  [groupID]
            );

            const rval: Array<GroupRoleProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get roles for the target group - ${error}`, 500);
        }
    };

    static async fetch_permissions() {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM permissiontypes`,
                  []
            );

            const rval: Array<GroupRoleProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get group permissions - ${error}`, 500);
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

    static async fetch_role_by_role_name(groupRoleName: string, groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name,
                        group_id
                  FROM grouproles
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
                "grouproles",
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
                `DELETE FROM grouproles
                WHERE id = $1
                RETURNING id`,
            [groupRoleID]);
    
            const rval: GroupRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role - ${error}`, 500);
        }
    };

    static async delete_role_permissions_by_group_id(groupID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            groupID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM grouproles_permissiontypes
                WHERE grouproles_permissiontypes.grouprole_id IN (
                    SELECT grouproles.id FROM grouproles
                    WHERE grouproles.group_id IN (${idxParams.join(', ')})
                )`;
            
            await pgdb.query(query, queryParams);
            
            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_role_permissions_by_group_id - ${error}`, 500);
        }
    };

    static async delete_roles_by_group_id(groupID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            groupID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM grouproles
                WHERE grouproles.group_id IN (${idxParams.join(', ')})`;
            
            console.log(query);
            await pgdb.query(query, queryParams);
            
            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_roles_by_group_id - ${error}`, 500);
        }
    };

    // PERMISSIONS Management
    static async create_permission(groupPermData: GroupPermProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO permissiontypes
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
                FROM permissiontypes
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
                "permissiontypes",
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
                `DELETE FROM permissiontypes
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
    static async create_role_permissions(permissionList: Array<GroupRolePermsProps>) {
        // console.log(permissionList);
        const valueExpressions: Array<string> = [];
        let queryValues = [permissionList[0].grouprole_id];

        for (const permission of permissionList) {
            if (permission.grouppermission_id) {
                queryValues.push(permission.grouppermission_id);
                valueExpressions.push(`($1, $${queryValues.length})`)
            }
        }

        const valueExpressionRows = valueExpressions.join(",");
        console.log(valueExpressionRows);

        try {
            const result = await pgdb.query(`
                INSERT INTO grouproles_permissiontypes
                    (grouprole_id, permission_id)
                VALUES
                    ${valueExpressionRows}
                RETURNING grouprole_id, permission_id`,
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
                    'group_read_group', 'group_update_group', 'group_delete_group',
                    'group_create_role', 'group_read_role', 'group_update_role', 'group_delete_role',
                    'group_read_group_permissions',
                    'group_create_role_permissions', 'group_read_role_permissions', 'group_delete_role_permissions',
                    'group_create_user_role', 'group_read_user_role', 'group_delete_user_role',
                    'group_create_group_user', 'group_read_group_user', 'group_delete_group_user',
                    'group_create_equip', 'group_read_equip', 'group_update_equip', 'group_delete_equip',
                    'group_create_room', 'group_read_room', 'group_update_room', 'group_delete_room'
                ],
                admin: [
                    'group_read_role',
                    'group_create_user_role', 'group_read_user_role', 'group_delete_user_role',
                    'group_create_group_user', 'group_read_group_user', 'group_delete_group_user',
                    'group_create_equip', 'group_read_equip', 'group_update_equip', 'group_delete_equip',
                    'group_create_room', 'group_read_room', 'group_update_room', 'group_delete_room'
                ],
                manage_room: [
                    'group_create_room', 'group_read_room', 'group_update_room', 'group_delete_room'
                ],
                manage_equip: [
                    'group_create_equip', 'group_read_equip', 'group_update_equip', 'group_delete_equip'
                ],
                user: [
                    'group_read_group', 'group_read_group_user', 'group_read_equip', 'group_read_room'
                ]
            };

            const queryColumns: Array<string> = ["grouprole_id", "permission_id"];
            const queryColIdxs: Array<string> = [];
            const queryParams: Array<any> = [];
            
            let idx = 1;
            // If this works its super inefficient and should be replaced at some point
            for (const key in newGroupPermissions) {
                newGroupPermissions[key].forEach(element => {
                    queryColIdxs.push(`
                    ( (SELECT get_group_role_uuid($${idx}, $${idx+1})), (SELECT get_permission_uuid($${idx+2})) )`);
                    queryParams.push(key, groupID, element);
                    idx += 3;
                });
            };

            const query = `
                INSERT INTO grouproles_permissiontypes
                    (${queryColumns.join(",")}) 
                VALUES ${queryColIdxs.join(",")} 
                RETURNING grouprole_id, permission_id`;

            // console.log(query);

            const result = await pgdb.query(query, queryParams);
            
            // console.log(result);
            const rval: Array<GroupRolePermsProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create role permissions for new group - ${error}`, 500);
        }
    };

    static async fetch_role_permissions_by_role_id(groupID: string, roleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT grouproles.id AS role_id,
                        grouproles.name AS role_name,
                        permissiontypes.id AS permission_id,
                        permissiontypes.name AS permission_name
                FROM grouproles
                LEFT JOIN grouproles_permissiontypes
                ON grouproles.id = grouproles_permissiontypes.grouprole_id
                LEFT JOIN permissiontypes
                ON grouproles_permissiontypes.permission_id = permissiontypes.id
                WHERE grouproles.group_id = $1 AND grouprole_id = $2`,
                [groupID, roleID]
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
                `DELETE FROM grouproles_permissiontypes
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
                `DELETE FROM grouproles_permissiontypes
                WHERE grouprole_id = $1
                RETURNING grouprole_id`,
            [groupRoleID]);

            const rval: GroupRolePermsProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error}`, 500);
        }
    };

    // static async delete_role_permissions_by_group_id(groupID: string) {
    //     try {
    //         const result = await pgdb.query(
    //             `DELETE FROM grouproles_grouppermissions
    //             WHERE grouprole_id IN 
    //             (
    //                 SELECT grouproles.id FROM grouproles
    //                 WHERE grouproles.group_id = $1
    //             )
    //             RETURNING grouprole_id`,
    //             [groupID]
    //         ); 

    //         const rval: GroupRolePermsProps | undefined = result.rows[0];
    //         return rval;    
    //     } catch (error) {
    //         throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error.message}`, 500);
    //     }   
    // };


    // User Role Management
    static async create_user_group_role_by_role_id(userIDs: Array<string>, groupRoleID: string) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userIDs.forEach((val) => {
                if (val) {
                    queryParams.push(val, groupRoleID);
                    idxParams.push(`($${idx}, $${idx+1})`);
                    idx+=2;
                };
            });

            query = `
                INSERT INTO user_grouproles 
                    (user_id, grouprole_id) 
                VALUES ${idxParams.join(', ')}
                RETURNING user_id, grouprole_id`;
            
            console.log(query);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<GroupUserRoleProps> = result.rows

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to assign user group role - ${error}`, 500);
        }
    };

    static async delete_user_group_roles_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_grouproles
                WHERE grouprole_id IN (
                    SELECT id FROM grouproles WHERE group_id = $1
                )`,
                [groupID]
            );

            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user group roles - ${error}`, 500);
        }
    };

    static async delete_user_group_roles_by_user_id(userIDs: Array<string>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userIDs.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM user_grouproles
                WHERE user_id IN (${idxParams.join(', ')})
            `;

            const result = await pgdb.query(query, queryParams);

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
                `SELECT userprofile.user_id AS user_id,
                        userprofile.username AS username,
                        grouproles.id AS role_id, 
                        grouproles.name AS role_name
                    FROM userprofile
                    LEFT JOIN user_grouproles 
                        ON userprofile.user_id = user_grouproles.user_id
                    LEFT JOIN groupRoles
                        ON user_grouproles.grouprole_id = grouproles.id
                    WHERE userprofile.user_id = $1 AND grouproles.group_id = $2`,
                    [userID, groupID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site group for the target user - ${error}`, 500);
        }
    };

    static async fetch_user_group_permissions_by_user_id(userID: string, groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT DISTINCT
                        permissiontypes.id AS permission_id,
                        permissiontypes.name AS permission_name
                    FROM permissiontypes
                    LEFT JOIN grouproles_permissiontypes
                        ON grouproles_permissiontypes.permission_id = permissiontypes.id
                    LEFT JOIN grouproles
                        ON grouproles.id = grouproles_permissiontypes.grouprole_id
                    LEFT JOIN user_grouproles
                        ON user_grouproles.grouprole_id = grouproles_permissiontypes.grouprole_id
                    WHERE user_grouproles.user_id = $1 AND grouproles.group_id = $2`,
                    [userID, groupID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site roles for the target user - ${error}`, 500);
        }  
    };
}


export default GroupPermissionsRepo;