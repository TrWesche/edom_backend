import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface UserObjectProps {
    id?: string,
    user_account?: UserAccountProps,
    user_profile?: UserProfileProps,
    user_data?: UserDataProps
    roles?: Array<UserRolesProps>,
    site_permissions?: Array<string>,
    group_permissions?: Array<string>,
    premissions?: Array<PermissionProps>
}

interface UserAccountProps {
    password?: string
};

interface UserProfileProps {
    username?: string,
    headline?: string,
    about?: string,
    image_url?: string,
    public?: boolean
};

interface UserDataProps {
    email?: string,
    public_email?: boolean,
    first_name?: string,
    public_first_name?: boolean,
    last_name?: string,
    public_last_name?: boolean,
    location?: string,
    public_location?: boolean
};

interface PermissionProps {
    permission_name: string,
    context: string
};

interface UserRolesProps {
    name?: string | undefined
};


class UserRepo {
    static async create_new_user(userData: UserObjectProps, hashedPassword: string) {
        try {
            const targetColumns: Array<string> = [];
            const idxValues: Array<string> = [];
            const insertValues: Array<any> = [];

            let idx = 1;
            for (const key in userData) {
                if (userData[key]) {
                    targetColumns.push(key);
                    idxValues.push(`$${idx}`);
                    insertValues.push(userData[key]);

                    idx++;
                }
            };

            const query = `
                INSERT INTO users 
                    (${targetColumns.join(", ")}) 
                VALUES (${idxValues.join(", ")}) 
                RETURNING id, email, username
            `;

            const result = await pgdb.query(
                query,
                insertValues
            );
            
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new user - ${error}`, 500);
        }
    };
    

    static async fetch_user_by_user_email(userEmail: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        email, 
                        username,
                        password
                  FROM users 
                  WHERE email ILIKE $1`,
                  [userEmail]
            );
    
            const rval: UserObjectProps | undefined = result.rows[0];
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