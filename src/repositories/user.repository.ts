import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface UserObjectProps {
    id?: string,
    email?: string,
    username?: string,
    password?: string,
    roles?: Array<UserRolesProps>
}

interface UserRolesProps {
    name?: string | undefined
}


class UserRepo {
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
                  WHERE email = $1`,
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
                  WHERE username = $1`,
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
                SELECT id, email, username
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