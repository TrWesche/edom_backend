import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface GroupObjectProps {
    id?: string,
    name?: string,
    headline?: string,
    description?: string,
    public?: boolean
};

export interface GroupUserProps {
    group_id?: string
    user_id?: string
};

interface IDList {
    id?: string
};

class GroupRepo {
    static async create_new_group(groupData: GroupObjectProps) {
        try {
            let queryColumns: Array<string> = [];
            let queryColIdxs: Array<string> = [];
            let queryParams: Array<any> = [];
            
            let idx = 1;
            for (const key in groupData) {
                if (groupData[key] !== undefined) {
                    queryColumns.push(key);
                    queryColIdxs.push(`$${idx}`);
                    queryParams.push(groupData[key]);
                    idx++;
                }
            };

            const query = `
                INSERT INTO sitegroups 
                    (${queryColumns.join(",")}) 
                VALUES (${queryColIdxs.join(",")}) 
                RETURNING id, name, headline, description, public`;

            const result = await pgdb.query(query, queryParams);
            
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new group - ${error}`, 500);
        }
    };

    static async fetch_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, name, headline, description, image_url, location
                  FROM sitegroups
                  WHERE id = $1`,
                  [groupID]
            );
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group - ${error}`, 500);
        };
    };

    static async fetch_public_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, name, headline, description, image_url, location, public
                  FROM sitegroups
                  WHERE id = $1 AND sitegroups.public = TRUE`,
                  [groupID]
            );
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group - ${error}`, 500);
        };
    };

    static async fetch_unrestricted_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, name, headline, description, image_url, location, public
                  FROM sitegroups
                  WHERE id = $1`,
                  [groupID]
            );
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group - ${error}`, 500);
        };
    };
    
    static async fetch_group_list_paginated(limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT id, name, headline, image_url, location
                FROM sitegroups
                WHERE sitegroups.public = true
                LIMIT $1
                OFFSET $2`,
                [limit, offset]
            );
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate groups - ${error}`, 500);
        }
    };

    static async fetch_public_group_list_by_user_id(userID: string, limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT
                    sitegroups.id AS id,
                    sitegroups.name AS name,
                    sitegroups.headline AS headline,
                    sitegroups.description AS description,
                    sitegroups.image_url AS image_url,
                    sitegroups.location AS location
                FROM sitegroups
                LEFT JOIN user_groups ON sitegroups.id = user_groups.group_id
                WHERE user_groups.user_id = $1 AND sitegroups.public = TRUE
                LIMIT $2
                OFFSET $3`,
                [userID, limit, offset]
            );
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate groups - ${error}`, 500);
        }
    };

    static async fetch_unrestricted_group_list_by_user_id(userID: string, limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT
                    sitegroups.id AS id,
                    sitegroups.name AS name,
                    sitegroups.headline AS headline,
                    sitegroups.description AS description,
                    sitegroups.image_url AS image_url,
                    sitegroups.location AS location
                FROM sitegroups
                LEFT JOIN user_groups ON sitegroups.id = user_groups.group_id
                WHERE user_groups.user_id = $1
                LIMIT $2
                OFFSET $3`,
                [userID, limit, offset]
            );
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate groups - ${error}`, 500);
        }
    };

    static async update_group_by_group_id(groupID: string, groupData: GroupObjectProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "sitegroups",
                groupData,
                "id",
                groupID
            );
    
            const result = await pgdb.query(query, values);

            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update group - ${error}`, 500);
        }
    };
    
    static async delete_groups_by_group_id(groupID: Array<IDList>) {
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
                DELETE FROM sitegroups
                WHERE sitegroups.id IN (${idxParams.join(', ')});`;
            
            console.log(query);
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_groups_by_group_id - ${error}`, 500);
        }
    };

    static async delete_group_user_roles_by_group_id(groupID: Array<IDList>) {
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
                DELETE FROM user_grouproles
                WHERE user_grouproles.grouprole_id IN (
                    SELECT grouproles.id FROM grouproles
                    WHERE grouproles.group_id IN (${idxParams.join(', ')})
                )`;
            
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_group_user_roles_by_group_id - ${error}`, 500);
        }
    };

    static async delete_group_users_by_group_id(groupID: Array<IDList>) {
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
                DELETE FROM user_groups
                WHERE user_groups.group_id IN (${idxParams.join(', ')})`;
            
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_group_users_by_group_id - ${error}`, 500);
        }
    };

    



    //  _   _ ____  _____ ____  
    // | | | / ___|| ____|  _ \ 
    // | | | \___ \|  _| | |_) |
    // | |_| |___) | |___|  _ < 
    //  \___/|____/|_____|_| \_\
    static async associate_user_to_group(userID: string, groupID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO user_groups 
                    (user_id, group_id) 
                VALUES ($1, $2) 
                RETURNING user_id, group_id`,
            [
                userID,
                groupID
            ]);
            
            const rval: GroupUserProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create group association group -> user - ${error}`, 500);
        }
    };

    static async disassociate_user_from_group(userID: string, groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_groups
                WHERE user_id = $1 AND group_id = $2
                RETURNING user_id, group_id`,
            [
                userID,
                groupID
            ]);
            
            const rval: GroupUserProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group association group -> user - ${error}`, 500);
        }
    };

    static async delete_user_grouproles_by_user_id(userID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM user_grouproles
                WHERE user_grouproles.user_id IN (${idxParams.join(', ')})`;
            
            // console.log(query);
            // console.log(queryParams);
            await pgdb.query(query, queryParams);
            // console.log("Delete User Groups Success");

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };

    static async delete_user_groups_by_user_id(userID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM user_groups
                WHERE user_groups.user_id IN (${idxParams.join(', ')})`;
            
            // console.log(query);
            // console.log(queryParams);
            await pgdb.query(query, queryParams);
            // console.log("Delete User Groups Success");

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };

    static async disassociate_users_from_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_grouproles
                WHERE user_grouproles IN (
                    SELECT grouproles.id FROM grouproles
                    WHERE grouproles.group_id = $1;
                );
                
                DELETE FROM user_groups
                WHERE user_groups.group_id = $1;`,
            [
                groupID
            ]);
            
            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group association group -> users - ${error}`, 500);
        }
    };

    static async fetch_groups_by_user_id(userID: string, groupPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (groupPublic !== undefined) {
                query = `
                    SELECT id, name, headline
                    FROM sitegroups
                    RIGHT JOIN user_groups
                    ON sitegroups.id = user_groups.group_id
                    WHERE user_groups.user_id = $1 AND sitegroups.public = $2`
                queryParams.push(userID, groupPublic);
            } else {
                query = `
                    SELECT id, name, headline
                    FROM sitegroups
                    RIGHT JOIN user_groups
                    ON sitegroups.id = user_groups.equip_id
                    WHERE sitegroups.user_id = $1`
                queryParams.push(userID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate user groups by user id - ${error}`, 500);
        }
    };

    static async fetch_group_users_by_group_id(groupID: string, userPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (userPublic) {
                query = `
                    SELECT 
                        userprofile.user_id AS id, 
                        userprofile.username AS username
                    FROM userprofile
                    RIGHT JOIN user_groups
                    ON userprofile.user_id = user_groups.user_id
                    WHERE user_groups.group_id = $1 AND userprofile.public = $2`
                queryParams.push(groupID, userPublic);
            } else {
                query = `
                    SELECT 
                        userprofile.user_id AS id, 
                        userprofile.username AS username
                    FROM userprofile
                    RIGHT JOIN user_groups
                    ON userprofile.user_id = user_groups.user_id
                    WHERE user_groups.group_id = $1`
                queryParams.push(groupID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group users by group id - ${error}`, 500);
        }
    };

    static async fetch_group_ids_by_user_id(userID: string, userRole?: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (userRole !== undefined) {
                query = `
                SELECT
                    sitegroups.id AS id
                FROM sitegroups
                LEFT JOIN user_groups ON user_groups.group_id = sitegroups.id
                LEFT JOIN user_grouproles ON user_grouproles.user_id = user_groups.user_id
                LEFT JOIN grouproles ON grouproles.id = user_grouproles.grouprole_id
                WHERE user_groups.user_id = $1 AND grouproles.name = $2`
                queryParams.push(userID, userRole);
            } else {
                query = `
                    SELECT
                        sitegroups.id AS id
                    FROM sitegroups
                    LEFT JOIN user_groups ON user_groups.group_id = sitegroups.id
                    WHERE user_groups.user_id = $1`
                queryParams.push(userID);
            };

            const result = await pgdb.query(query, queryParams);

            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };

    static async fetch_user_groups_by_user_id(userID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            query = `
                SELECT 
                    user_groups.group_id AS id, 
                    userprofile.username
                FROM userprofile
                RIGHT JOIN user_groups
                ON userprofile.account_id = user_groups.user_id
                WHERE userprofile.account_id = $1`
            queryParams.push(userID);

            const result = await pgdb.query(query, queryParams);
    
            // TODO: This return type is wrong
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };
}


export default GroupRepo;