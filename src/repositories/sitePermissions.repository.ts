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
                `INSERT INTO siteRoles
                    (name) 
                VALUES ($1) 
                RETURNING id, name, site_id`,
            [
                siteRoleData.name
            ]);
            
            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new site role - ${error}`, 500);
        }
    }; 

    static async fetch_roles_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(
                `SELECT users.id AS user_id,
                        users.username AS username,
                        siteRoles.id AS role_id, 
                        siteRoles.name AS role_name
                    FROM users
                    LEFT JOIN user_siteRoles 
                        ON users.id = user_siteRoles.user_id
                    LEFT JOIN siteRoles
                        ON user_siteRoles.role_id = siteRoles.id
                    WHERE user_id = $1`,
                    [userID]
            );

            // const rval: Array<siteRoleProps> | undefined = result.rows;
            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to get site roles for the target user - ${error}`, 500);
        }
    };

    static async fetch_role_by_role_id(siteRoleID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name
                  FROM siteRoles
                  WHERE id = $1`,
                  [siteRoleID]
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
                "siteRoles",
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
                `DELETE FROM siteRoles
                WHERE id = $1
                RETURNING id`,
            [siteRoleID]);
    
            const rval: SiteRoleProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete site role - ${error}`, 500);
        }
    };


    // PERMISSIONS Management
    static async create_new_permission(sitePermData: SitePermProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO sitePermissions
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
                  FROM sitePermissions
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
                "sitePermissions",
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
                `DELETE FROM sitePermissions
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
                INSERT INTO siteRole_sitePermissions
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
                `SELECT siteRoles.id AS role_id,
                        siteRoles.name AS role_name,
                        sitePermissions.id AS permission_id,
                        sitePermissions.name AS permission_name
                  FROM siteRoles
                  LEFT JOIN siteRole_sitePermissions AS joinTable
                  ON siteRoles.id = siteRole_sitePermissions.role_id
                  LEFT JOIN sitePermissions
                  ON joinTable.permission_id = sitePermissions.id
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
                `DELETE FROM siteRole_sitePermissions
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