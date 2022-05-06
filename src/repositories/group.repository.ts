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

export interface GroupInviteProps {
    group_id: string,
    user_id: string,
    username: string,
    group_request: boolean,
    user_request: boolean,
    group_name?: string,
    image_url?: string
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

    static async fetch_public_group_list_by_user_id(
        userID: string, 
        limit: number, 
        offset: number,
        search: string | null    
    ) {
        try {
            let idx = 4;
            const filterParams: Array<any> = ['sitegroups.public = TRUE', 'user_groups.user_id = $1'];
            const queryParams: Array<any> = [userID, limit, offset];

            if (search) {
                filterParams.push(
                    `(sitegroups.name ILIKE $${idx} OR
                        sitegroups.headline ILIKE $${idx} OR
                        sitegroups.description ILIKE $${idx})`,
                );
                queryParams.push(`%${search}%`);
                idx++;
            };

            let query = `
                SELECT
                    sitegroups.id AS id,
                    sitegroups.name AS name,
                    sitegroups.headline AS headline,
                    sitegroups.description AS description,
                    sitegroups.image_url AS image_url,
                    sitegroups.location AS location
                FROM sitegroups
                LEFT JOIN user_groups ON sitegroups.id = user_groups.group_id
                WHERE ${filterParams.join(" AND ")}
                LIMIT $2
                OFFSET $3
            `;

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate groups - ${error}`, 500);
        }
    };

    static async fetch_member_requests_by_gid_usernames(groupID: string, usernames: Array<string>) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID];
            
            usernames.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                SELECT
                    group_membership_requests.group_id AS group_id,
                    sitegroups.name AS group_name,
                    userprofile.user_id AS user_id,
                    userprofile.username AS username,
                    group_membership_requests.group_request AS group_request,
                    group_membership_requests.user_request AS user_request
                FROM userprofiles
                LEFT OUTER JOIN group_membership_requests ON group_membership_requests.user_id = user_profile.user_id
                LEFT JOIN userprofile ON userprofile.user_id = group_membership_requests.user_id
                LEFT JOIN sitegroups ON sitegroups.id = group_membership_requests.group_id
                WHERE group_membership_requests.group_id = $1 AND (userprofile.username ILIKE ${idxParams.join('OR userprofile.username ILIKE')})`;

            // console.log(query);
            const result = await pgdb.query(query, queryParams);

            const rVal: Array<GroupInviteProps> | undefined = result.rows;
            return rVal;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };

    static async fetch_member_requests_by_group_id(groupID: string) {
        let query: string;

        query = `
            SELECT
                group_membership_requests.group_id AS group_id,
                sitegroups.name AS group_name,
                group_membership_requests.user_id AS user_id,
                userprofile.username AS username,
                group_membership_requests.group_request AS group_request,
                group_membership_requests.user_request AS user_request,
                sitegroups.image_url AS image_url
            FROM group_membership_requests
            LEFT JOIN sitegroups ON sitegroups.id = group_membership_requests.group_id
            LEFT JOIN userprofile ON userprofile.user_id = group_membership_requests.user_id
            WHERE group_membership_requests.group_ID = $1`;

        const result = await pgdb.query(
            query,
            [groupID]
        );

        const rval: Array<GroupInviteProps> | undefined = result.rows;
        return rval;
    };

    static async fetch_unrestricted_group_list_by_user_id(
        userID: string, 
        limit: number, 
        offset: number,
        search: string | null    
    ) {
        try {
            let idx = 4;
            const filterParams: Array<any> = ['user_groups.user_id = $1'];
            const queryParams: Array<any> = [userID, limit, offset];

            if (search) {
                filterParams.push(
                    `(sitegroups.name ILIKE $${idx} OR
                        sitegroups.headline ILIKE $${idx} OR
                        sitegroups.description ILIKE $${idx})`,
                );
                queryParams.push(`%${search}%`);
                idx++;
            };

            let query = `
                SELECT
                    sitegroups.id AS id,
                    sitegroups.name AS name,
                    sitegroups.headline AS headline,
                    sitegroups.description AS description,
                    sitegroups.image_url AS image_url,
                    sitegroups.location AS location
                FROM sitegroups
                LEFT JOIN user_groups ON sitegroups.id = user_groups.group_id
                WHERE ${filterParams.join(" AND ")}
                LIMIT $2
                OFFSET $3
            `;

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<GroupObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate groups - ${error}`, 500);
        }
    };

    // https://dba.stackexchange.com/questions/267410/show-values-from-list-that-are-not-returned-by-query
    // https://stackoverflow.com/questions/19363481/select-rows-which-are-not-present-in-other-table/19364694#19364694
    static async fetch_active_member_requests_by_uid_gid(userID: Array<string>, groupID: string, userToGroup: boolean, groupToUser: boolean) {
        try {
            let idx = 4;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID, userToGroup, groupToUser];
            
            userID.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                SELECT ARRAY (
                    SELECT uid AS user_id
                    FROM unnest(ARRAY[${idxParams.join(', ')}]::uuid[]) v(uid)
                    LEFT JOIN group_membership_requests gmr ON gmr.user_id = uid
                    WHERE  gmr.user_id IS NOT NULL AND gmr.group_id = $1 AND gmr.user_request = $2 and gmr.group_request = $3
                )
            `;
            
            // console.log(query);
            // console.log(queryParams);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<string> = result.rows[0].array

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to query active user requests to join group - ${error}`, 500);
        }
    };


    static async fetch_request_permitted_by_uid_gid(userID: Array<string>, groupID: string) {
        try {
            let idx = 3;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID, groupID];
            
            userID.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                SELECT ARRAY (
                    SELECT uid AS user_id
                    FROM unnest(ARRAY[${idxParams.join(', ')}]::uuid[]) v(uid)
                    WHERE (
                        NOT EXISTS (SELECT FROM group_membership_requests gmr WHERE gmr.user_id = uid AND gmr.group_id = $1) AND
                        NOT EXISTS (SELECT FROM user_groups ug WHERE ug.user_id = uid AND ug.group_id = $2)
                    )
                )
            `;
            
            // console.log(query);
            // console.log(queryParams);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<string> = result.rows[0].array

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to query active user requests to join group - ${error}`, 500);
        }
    };


    static async fetch_group_members_of_group_by_uid_gid(userID: Array<string>, groupID: string) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID];
            
            userID.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                SELECT ARRAY (
                    SELECT 
                        user_groups.user_id AS user_id
                    FROM user_groups
                    WHERE user_groups.group_id = $1 AND user_groups.user_id IN (${idxParams.join(', ')})
                )
            `;
            
            // console.log(query);
            // console.log(queryParams);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<string> = result.rows[0].array

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to query user ids for user in target group - ${error}`, 500);
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
            
            // console.log(query);
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
    static async create_request_group_to_user(userIDs: Array<string>, groupID: string) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userIDs.forEach((val) => {
                if (val) {
                    queryParams.push(val, groupID);
                    idxParams.push(`($${idx}, $${idx+1}, TRUE, FALSE, 'You have been invited to join this group!')`);
                    idx+=2;
                };
            });

            query = `
                INSERT INTO group_membership_requests 
                    (user_id, group_id, group_request, user_request, message) 
                VALUES ${idxParams.join(', ')}
                RETURNING user_id, group_id`;
            
            // console.log(query);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<GroupUserProps> = result.rows

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to invite user to group - ${error}`, 500);
        }
    };

    static async create_request_user_to_group(userID: string, groupID: string) {
        try {
            let query: string;
            const queryParams: Array<any> = [userID, groupID];

            query = `
                INSERT INTO group_membership_requests 
                    (user_id, group_id, group_request, user_request, message) 
                VALUES ($1, $2, FALSE, TRUE, 'A user has requested to join your group!')
                RETURNING user_id, group_id`;
            
            // console.log(query);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<GroupUserProps> = result.rows

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to invite user to group - ${error}`, 500);
        }
    };

    static async associate_user_to_group(userIDs: Array<string>, groupID: string) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userIDs.forEach((val) => {
                if (val) {
                    queryParams.push(val, groupID);
                    idxParams.push(`($${idx}, $${idx+1})`);
                    idx+=2;
                };
            });

            query = `
                INSERT INTO user_groups 
                    (user_id, group_id) 
                VALUES ${idxParams.join(', ')}
                RETURNING user_id, group_id`;
            
            // console.log(query);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<GroupUserProps> = result.rows

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create group association group -> user - ${error}`, 500);
        }
    };

    static async disassociate_user_from_group(userIDs: Array<string>, groupID: string) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID];
            
            userIDs.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM user_groups 
                WHERE group_id = $1 AND user_id IN (${idxParams.join(', ')})
                RETURNING user_id, group_id`;
            
            // console.log(query);
            const result = await pgdb.query(query, queryParams);
            const rVal: Array<GroupUserProps> = result.rows

            return rVal;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete group association group -> user - ${error}`, 500);
        }
    };

    static async delete_request_user_group(userIDs: Array<string>, groupID: string) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID];
            
            userIDs.forEach((val) => {
                if (val) {
                    queryParams.push(val);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM group_membership_requests
                WHERE group_membership_requests.group_id = $1 AND group_membership_requests.user_id IN (${idxParams.join(', ')})`;

            await pgdb.query(query, queryParams);
            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - Unable to delete user group membership request - ${error}`, 500);
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
            
            await pgdb.query(query, queryParams);
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
                    SELECT id, name, headline, image_url
                    FROM sitegroups
                    RIGHT JOIN user_groups
                    ON sitegroups.id = user_groups.group_id
                    WHERE user_groups.user_id = $1 AND sitegroups.public = $2`
                queryParams.push(userID, groupPublic);
            } else {
                query = `
                    SELECT id, name, headline, image_url
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