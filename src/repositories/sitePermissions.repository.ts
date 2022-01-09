import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface SiteRoleProps {
    id?: string,
    name?: string
}


export interface SitePermProps {
    id?: string,
    name?: string
}


export interface SiteRolePermsProps {
    role_id?: string,
    permission_id?: string
}


class SitePermissionsRepo {
    // ROLE Management
    static async create_new_role(siteRoleData: SiteRoleProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO siteroles
                    (name) 
                VALUES ($1) 
                RETURNING id, name`,
            [
                siteRoleData.name
            ]);
            
            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new site role - ${error}`, 500);
        }
    }; 

    static async fetch_role_by_role_id(siteRoleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM siteroles
                  WHERE id = $1`,
                  [siteRoleID]
            );
    
            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate site role - ${error}`, 500);
        };
    };

    static async fetch_role_by_role_name(siteRoleName: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM siteroles
                  WHERE name = $1`,
                  [siteRoleName]
            );
    
            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate site role - ${error}`, 500);
        };
    };

    static async update_role_by_role_id(siteRoleID: string, siteRoleData: SiteRoleProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "siteroles",
                siteRoleData,
                "id",
                siteRoleID
            );
    
            const result = await pgdb.query(query, values);

            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update site role - ${error}`, 500);
        }
    };
    
    static async delete_role_by_role_id(siteRoleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM siteroles
                WHERE id = $1
                RETURNING id`,
            [siteRoleID]);
    
            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete site role - ${error}`, 500);
        }
    };


    // User Role Management
    static async create_user_site_role(userID: string, siteRoleID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO user_siteroles
                    (user_id, siterole_id) 
                VALUES ($1, $2) 
                RETURNING user_id, siterole_id`,
            [
                userID, siteRoleID
            ]);

            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to assign user site role - ${error}`, 500);
        }
    };

    static async delete_user_site_roles_all(userID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_siteroles
                WHERE user_id = $1`,
                [userID]
            );

            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user site roles - ${error}`, 500);
        }
    };

    static async delete_user_site_role_by_role_id(userID: string, roleID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_siteroles
                WHERE user_id = $1 AND site_roleid = $2`,
                [userID, roleID]
            );

            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user site roles - ${error}`, 500);
        }
    };

    static async fetch_roles_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(
                `SELECT users.id AS user_id,
                        users.username AS username,
                        siteroles.id AS role_id, 
                        siteroles.name AS role_name
                    FROM users
                    LEFT JOIN user_siteroles 
                        ON users.id = user_siteroles.user_id
                    LEFT JOIN siteroles
                        ON user_siteroles.role_id = siteroles.id
                    WHERE user_id = $1`,
                    [userID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site roles for the target user - ${error}`, 500);
        }
    };

    static async fetch_permissions_by_user_id(userID: string) {

        try {
            const result = await pgdb.query(
                `SELECT DISTINCT
                        sitepermissions.id AS permission_id,
                        sitepermissions.name AS permission_name
                    FROM sitepermissions
                    LEFT JOIN siterole_sitepermissions
                        ON siterole_sitepermissions.sitepermission_id = sitepermissions.id
                    LEFT JOIN user_siteroles
                        ON user_siteroles.siterole_id = siterole_sitepermissions.siterole_id
                    WHERE user_siteroles.user_id = $1`,
                    [userID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            // console.log(error);
            throw new ExpressError(`An Error Occured: Unable to get site permissions for the target user - ${error}`, 500);
        }  
    };



    // PERMISSIONS Management
    static async create_new_permission(sitePermData: SitePermProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO sitepermissions
                    (name) 
                VALUES ($1) 
                RETURNING id, name`,
            [
                sitePermData.name,
            ]);
            
            const rval: SitePermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new site permission - ${error}`, 500);
        }
    };

    static async fetch_permission_by_permission_id(sitePermID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM sitepermissions
                  WHERE id = $1`,
                  [sitePermID]
            );
    
            const rval: SitePermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate site permission - ${error}`, 500);
        };
    };

    static async update_permission_by_permission_id(sitePermID: string, sitePermData: SitePermProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "sitepermissions",
                sitePermData,
                "id",
                sitePermID
            );
    
            const result = await pgdb.query(query, values);

            const rval: SitePermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update site permission - ${error}`, 500);
        }
    };
    
    static async delete_permission_by_permission_id(sitePermID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM sitepermissions
                WHERE id = $1
                RETURNING id`,
            [sitePermID]);
    
            const rval: SitePermProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete site permission - ${error}`, 500);
        }
    }; 


    // ROLE PERMISSIONS ASSOCIATIONS Management
    static async create_role_permissions(siteRoleID: string, permissionList: Array<string>) {
        const valueExpressions: Array<string> = [];
        let queryValues = [siteRoleID];
    
        for (const permission of permissionList) {
            if (permission) {
                queryValues.push(permission);
                valueExpressions.push(`($1, $${queryValues.length})`)
            }
        }
    
        const valueExpressionRows = valueExpressions.join(",");
    
        try {
            const result = await pgdb.query(`
                INSERT INTO siterole_sitepermissions
                    (role_id, permission_id)
                VALUES
                    ${valueExpressionRows}
                RETURNING role_id, permission_id`,
            queryValues);
            
            const rval: Array<SiteRolePermsProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new site role permission(s) - ${error}`, 500);
        };
    };

    static async fetch_role_permissions_by_role_id(siteRoleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT siteroles.id AS role_id,
                        siteroles.name AS role_name,
                        sitepermissions.id AS permission_id,
                        sitepermissions.name AS permission_name
                  FROM siteroles
                  LEFT JOIN siterole_sitepermissions AS joinTable
                  ON siteroles.id = siterole_sitepermissions.role_id
                  LEFT JOIN sitepermissions
                  ON joinTable.permission_id = sitepermissions.id
                  WHERE role_id = $1`,
                  [siteRoleID]
            );
    
            const rval = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate site role permissions - ${error}`, 500);
        };
    };
    
    static async delete_role_permissions_by_role_permission_ids(siteRoleID: string, sitePermID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM siterole_sitepermissions
                WHERE role_id = $1 AND permission_id = $2
                RETURNING role_id`,
            [siteRoleID, sitePermID]);
    
            const rval: SiteRolePermsProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete site role permission - ${error}`, 500);
        }
    };

}


export default SitePermissionsRepo;