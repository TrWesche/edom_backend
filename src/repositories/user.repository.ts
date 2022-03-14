import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";
import { UserRegisterProps } from "../schemas/user/userRegisterSchema";
import { UserUpdateProps } from "../schemas/user/userUpdateSchema";


export interface UserObjectProps {
    user_data?: UserDataProps
    roles?: Array<UserRolesProps>,
    site_permissions?: Array<string>,
    group_permissions?: Array<string>,
    premissions?: Array<PermissionProps>
};

interface UserDataProps {
    id?: string,
    password?: string,
    username?: string,
    headline?: string,
    about?: string,
    image_url?: string,
    email?: string,
    first_name?: string,
    last_name?: string,
    location?: string,
    public_profile?: boolean,
    public_email?: boolean,
    public_first_name?: boolean,
    public_last_name?: boolean,
    public_location?: boolean  
};

interface PermissionProps {
    permission_name: string,
    context: string
};

interface UserRolesProps {
    name?: string | undefined
};

type fetchType = "unique" | "auth" | "profile" | "account"

class UserRepo {
    // Tested - 03/12/2022
    static async create_new_user(userData: UserRegisterProps) {
        try {
            const query = `
                SELECT * FROM create_user_account($1, $2, $3, $4, $5)
            `;

            const insertValues = [
                userData.username,
                userData.password,
                userData.email,
                userData.first_name ? userData.first_name : "",
                userData.last_name ? userData.last_name : ""
            ];


            const result = await pgdb.query(
                query,
                insertValues
            );

            const rval: UserDataProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new user - ${error}`, 500);
        }
    };

    // Tested - 03/12/2022
    static async fetch_user_by_user_email(userEmail: string, fetchType?: fetchType) {
        try {
            let query: string;
            switch (fetchType) {
                case 'unique': 
                    query = `
                        SELECT email
                        FROM userdata
                        WHERE email ILIKE $1`;
                    break;
                case 'auth':
                    query = `SELECT
                        userdata.account_id AS id,
                        userdata.email AS email,
                        useraccount.password AS password
                    FROM userdata
                    LEFT JOIN useraccount ON useraccount.id = userdata.account_id
                    WHERE email ILIKE $1`;
                    break;
                case 'profile':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        userprofile.headline AS headline,
                        userprofile.about AS about,
                        userprofile.image_url AS image_url,
                        userprofile.public AS public_profile,
                        userdata.email AS email,
                        userdata.public_email AS public_email,
                        userdata.first_name AS first_name,
                        userdata.public_first_name AS public_first_name,
                        userdata.last_name AS last_name,
                        userdata.public_last_name AS public_last_name,
                        userdata.location AS location,
                        userdata.public_location AS public_location
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    LEFT JOIN userdata ON userdata.account_id = useraccount.id
                    WHERE email ILIKE $1`;
                case 'account':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        userprofile.headline AS headline,
                        userprofile.about AS about,
                        userprofile.image_url AS image_url,
                        userprofile.public AS public_profile,
                        userdata.email AS email,
                        userdata.public_email AS public_email,
                        userdata.first_name AS first_name,
                        userdata.public_first_name AS public_first_name,
                        userdata.last_name AS last_name,
                        userdata.public_last_name AS public_last_name,
                        userdata.location AS location,
                        userdata.public_location AS public_location
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    LEFT JOIN userdata ON userdata.account_id = useraccount.id
                    WHERE email ILIKE $1`;
                    break;
                default:
                    query = `
                        SELECT email
                        FROM userdata
                        WHERE email ILIKE $1`;
                    break;
            };

            const result = await pgdb.query(
                query,
                [userEmail]
            );
    
            const rval: UserDataProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured During Query Execution - ${this.caller} - ${error}`, 500);
        };
    };

    // Tested - 03/12/2022
    static async fetch_user_by_username(username: string, fetchType?: fetchType) {
        try {
            let query: string;
            switch (fetchType) {
                case 'unique': 
                    query = `
                        SELECT username
                        FROM userprofile
                        WHERE username ILIKE $1`;
                    break;
                case 'auth':
                    query = `SELECT
                        userprofile.account_id AS id,
                        userprofile.username AS username,
                        useraccount.password AS password
                    FROM userprofile
                    LEFT JOIN useraccount ON useraccount.id = userprofile.account_id
                    WHERE username ILIKE $1`;
                    break;
                case 'profile':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        userprofile.headline AS headline,
                        userprofile.about AS about,
                        userprofile.image_url AS image_url,
                        userprofile.public AS public_profile,
                        userdata.email AS email,
                        userdata.public_email AS public_email,
                        userdata.first_name AS first_name,
                        userdata.public_first_name AS public_first_name,
                        userdata.last_name AS last_name,
                        userdata.public_last_name AS public_last_name,
                        userdata.location AS location,
                        userdata.public_location AS public_location
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    LEFT JOIN userdata ON userdata.account_id = useraccount.id
                    WHERE username ILIKE $1`;
                case 'account':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        userprofile.headline AS headline,
                        userprofile.about AS about,
                        userprofile.image_url AS image_url,
                        userprofile.public AS public_profile,
                        userdata.email AS email,
                        userdata.public_email AS public_email,
                        userdata.first_name AS first_name,
                        userdata.public_first_name AS public_first_name,
                        userdata.last_name AS last_name,
                        userdata.public_last_name AS public_last_name,
                        userdata.location AS location,
                        userdata.public_location AS public_location
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    LEFT JOIN userdata ON userdata.account_id = useraccount.id
                    WHERE username ILIKE $1`;
                    break;
                default:
                    query = `
                        SELECT username
                        FROM userprofile
                        WHERE username ILIKE $1`;
                    break;
            };

            const result = await pgdb.query(
                query,
                [username]
            );
    
            const rval: UserDataProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured During Query Execution - ${this.caller} - ${error}`, 500);
        };
    };

    // Tested - 03/12/2022
    static async fetch_user_by_user_id(userID: string, fetchType?: fetchType) {
        try {
            let query: string;
            switch (fetchType) {
                case 'unique': 
                    query = `
                        SELECT id
                        FROM useraccount
                        WHERE id = $1`;
                    break;
                case 'auth':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        useraccount.password AS password
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    WHERE id = $1`;
                    break;
                case 'profile':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        userprofile.headline AS headline,
                        userprofile.about AS about,
                        userprofile.image_url AS image_url,
                        userprofile.public AS public_profile,
                        userdata.email AS email,
                        userdata.public_email AS public_email,
                        userdata.first_name AS first_name,
                        userdata.public_first_name AS public_first_name,
                        userdata.last_name AS last_name,
                        userdata.public_last_name AS public_last_name,
                        userdata.location AS location,
                        userdata.public_location AS public_location
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    LEFT JOIN userdata ON userdata.account_id = useraccount.id
                    WHERE id = $1`;
                case 'account':
                    query = `SELECT
                        useraccount.id AS id,
                        userprofile.username AS username,
                        userprofile.headline AS headline,
                        userprofile.about AS about,
                        userprofile.image_url AS image_url,
                        userprofile.public AS public_profile,
                        userdata.email AS email,
                        userdata.public_email AS public_email,
                        userdata.first_name AS first_name,
                        userdata.public_first_name AS public_first_name,
                        userdata.last_name AS last_name,
                        userdata.public_last_name AS public_last_name,
                        userdata.location AS location,
                        userdata.public_location AS public_location
                    FROM useraccount
                    LEFT JOIN userprofile ON userprofile.account_id = useraccount.id
                    LEFT JOIN userdata ON userdata.account_id = useraccount.id
                    WHERE id = $1`;
                    break;
                default:
                    query = `
                        SELECT id
                        FROM useraccount
                        WHERE id = $1`;
                    break;
            };

            const result = await pgdb.query(
                query,
                [userID]
            );
    
            const rval: UserDataProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured During Query Execution - ${this.caller} - ${error}`, 500);
        };
    };

    // Tested - 03/13/2022
    static async fetch_user_list_paginated(limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT username, headline, image_url
                FROM userprofile
                WHERE userprofile.public = TRUE
                LIMIT $1
                OFFSET $2`,
                [limit, offset]
            );
    
            const rval: Array<UserDataProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate users - ${error}`, 500);
        }
    };

    // Tested - 03/12/2022
    static async update_user_by_user_id(userID: string, userData: UserUpdateProps) {
        try {
            let updateSuccess = true;

            await pgdb.query("BEGIN");

            // Password Update
            if (userData.user_account) {
                // Parital Update: table name, payload data, lookup column name, lookup key
                const {query, values} = createUpdateQueryPGSQL(
                    "useraccount",
                    userData.user_account,
                    "id",
                    userID
                );

                const result = await pgdb.query(query, values);
                updateSuccess = updateSuccess && (result.rowCount != 0);
            };

            // User Data Update
            if (userData.user_data) {
                // Parital Update: table name, payload data, lookup column name, lookup key
                const {query, values} = createUpdateQueryPGSQL(
                    "userdata",
                    userData.user_data,
                    "account_id",
                    userID
                );

                const result = await pgdb.query(query, values);
                updateSuccess = updateSuccess && (result.rowCount != 0);
            };


            // User Profile Update
            if (userData.user_profile) {
                // Parital Update: table name, payload data, lookup column name, lookup key
                const {query, values} = createUpdateQueryPGSQL(
                    "userprofile",
                    userData.user_profile,
                    "account_id",
                    userID
                );

                const result = await pgdb.query(query, values);
                updateSuccess = updateSuccess && (result.rowCount != 0);
            };

            await pgdb.query("COMMIT");

            return updateSuccess;
        } catch (error) {
            await pgdb.query("ROLLBACK");
            throw new ExpressError(`An Error Occured: Unable to update user - ${error}`, 500);
        }
    };
    
    // Tested - 03/13/2022
    static async delete_user_by_user_id(userID: string) {
        try {
            console.log("Called Delete User by User ID");
            await pgdb.query(
                `SELECT delete_user_account($1)`,
                [userID]);

            return true;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user - ${error}`, 500);
        }
    };
}


export default UserRepo;