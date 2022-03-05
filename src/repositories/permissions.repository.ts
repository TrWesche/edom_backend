import ExpressError from "../utils/expresError";
import pgdb from "../databases/postgreSQL/pgdb";


class PermissionsRepo {
    static async fetch_permissions_by_user_id(userID: string) {

        try {
            const result = await pgdb.query(
                `SELECT * FROM get_user_permissions($1)`,
                    [userID]
            );

            return result.rows;
        } catch (error) {
            // console.log(error);
            throw new ExpressError(`An Error Occured: Unable to get user permissions for the target user - ${error}`, 500);
        }  
    };
}


export default PermissionsRepo;