import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";
import { UserRegisterProps } from "../schemas/user/userRegisterSchema";


export interface UserObjectProps {
    // id?: string,
    // user_account?: UserAccountProps,
    // user_profile?: UserProfileProps,
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

// interface UserAccountProps {
//     password?: string
// };

// interface UserProfileProps {
//     username?: string,
//     headline?: string,
//     about?: string,
//     image_url?: string,
//     public?: boolean
// };

// interface UserDataProps {
//     email?: string,
//     public_email?: boolean,
//     first_name?: string,
//     public_first_name?: boolean,
//     last_name?: string,
//     public_last_name?: boolean,
//     location?: string,
//     public_location?: boolean
// };

interface PermissionProps {
    permission_name: string,
    context: string
};

interface UserRolesProps {
    name?: string | undefined
};


class UserRepo {
    static async create_new_user(userData: UserRegisterProps) {
        try {
            const idxValues: Array<string> = [];
            const insertValues: Array<any> = [];

            let idx = 1;
            for (const key in userData) {
                if (userData[key]) {
                    idxValues.push(`$${idx}`);
                    insertValues.push(userData[key]);

                    idx++;
                }
            };

            const query = `
                SELECT * FROM create_user_account(${idxValues.join(",")})
            `

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

    static async fetch_user_by_user_email(userEmail: string, authenticate?: boolean) {
        try {
            let query: string;
            if (authenticate === true) {
                query = `
                    SELECT
                        userdata.account_id AS id,
                        userdata.email AS email,
                        useraccount.password AS password
                    FROM userdata
                    LEFT JOIN useraccount ON useraccount.id = userdata.account_id
                    WHERE email ILIKE $1`;
            } else {
                query = `
                    SELECT email
                    FROM userdata
                    WHERE email ILIKE $1`
            };

            const result = await pgdb.query(
                query,
                [userEmail]
            );
    
            const rval: UserDataProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
        };
    };
    

    static async fetch_user_by_username(username: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        email, 
                        username,
                        password
                  FROM users 
                  WHERE username ILIKE $1`,
                  [username]
            );
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
        };
    };


    static async fetch_user_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(`
                SELECT id, email, username, first_name, last_name
                FROM users
                WHERE id = $1`,
                [userID]
            );
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
        }
    };
    

    static async update_user_by_user_id(userID: string, userData: UserObjectProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "users",
                userData,
                "id",
                userID
            );

            const result = await pgdb.query(query, values);

            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update user - ${error}`, 500);
        }
    };
    
    
    static async delete_user_by_user_id(userID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM users 
                WHERE id = $1
                RETURNING id`,
            [userID]);
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user - ${error}`, 500);
        }
    };
}


export default UserRepo;