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
                INSERT INTO groups 
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
                `SELECT id, name, headline, description, public
                  FROM groups
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
                SELECT id, name, headline
                FROM groups
                LIMIT $1
                OFFSET $2
                WHERE groups.public = TRUE`,
                [limit, offset]
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
                "groups",
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
    
    static async delete_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM groups
                WHERE id = $1
                RETURNING id`,
            [groupID]);
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group - ${error}`, 500);
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

    static async disassociate_users_from_group_by_group_id(groupID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_groups
                WHERE group_id = $1
                RETURNING user_id, group_id`,
            [
                groupID
            ]);
            
            const rval: GroupUserProps | undefined = result.rows[0];
            return rval;
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
                    FROM groups
                    RIGHT JOIN user_groups
                    ON groups.id = user_groups.group_id
                    WHERE user_groups.user_id = $1 AND groups.public = $2`
                queryParams.push(userID, groupPublic);
            } else {
                query = `
                    SELECT id, name, headline
                    FROM groups
                    RIGHT JOIN user_groups
                    ON groups.id = user_groups.equip_id
                    WHERE groups.user_id = $1`
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

            if (userPublic !== undefined) {
                query = `
                    SELECT id, name
                    FROM users
                    RIGHT JOIN user_groups
                    ON user.id = user_groups.user_id
                    WHERE user_groups.group_id = $1 AND users.public = $2`
                queryParams.push(groupID, userPublic);
            } else {
                query = `
                    SELECT id, name
                    FROM users
                    RIGHT JOIN user_groups
                    ON user.id = user_groups.user_id
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
}


export default GroupRepo;