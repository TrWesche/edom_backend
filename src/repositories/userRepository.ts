import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface UserObjectProps {
    id?: string,
    email?: string,
    username?: string,
    password?: string,
    permissions?: UserPermissionsProps
}

interface UserPermissionsProps {
    id?: string,
    role: string
}


class UserRepository {
    static async create_new_user(userData: UserObjectProps, hashedPassword: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO users 
                    (email, username, password) 
                VALUES ($1, $2, $3) 
                RETURNING id, email, username`,
            [
                userData.email,
                userData.username,
                hashedPassword
            ]);
            
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;

            // return result.rows[0];
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new user - ${error}`, 500);
        }
    };
    
    static async fetch_user_by_user_email(user_email: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        email, 
                        username,
                        password
                  FROM users 
                  WHERE email = $1`,
                  [user_email]
            );
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;

            // return result.rows[0];
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
                  WHERE username = $1`,
                  [username]
            );
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;

            // return result.rows[0];
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
        };
    };

    static async fetch_user_by_user_id(user_id: string) {
        try {
            const result = await pgdb.query(`
                SELECT id, email, username
                FROM users
                WHERE id = $1`,
                [user_id]
            );
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;

            // return result.rows[0];
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate user - ${error}`, 500);
        }
    };
    
    static async update_user_by_user_id(user_id: string, data: UserObjectProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "users",
                data,
                "id",
                user_id
            );
    
            const result = await pgdb.query(query, values);

            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;

            // return result.rows[0];
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update user - ${error}`, 500);
        }
    };
    
    static async delete_user_by_user_id(user_id: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM users 
                WHERE id = $1
                RETURNING id`,
            [user_id]);
    
            const rval: UserObjectProps | undefined = result.rows[0];
            return rval;

            // return result.rows[0];
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete user - ${error}`, 500);
        }
    };
}


export default UserRepository;