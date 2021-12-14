import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface RobotObjectProps {
    id?: string,
    name?: string,
    description?: string,
    config?: object 
}


class RobotRepo {
    static async create_new_robot(robotData: RobotObjectProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO robots 
                    (name, description, config) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, name, description, public, config`,
            [
                robotData.name,
                robotData.description,
                robotData.config
            ]);
            
            const rval: RobotObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new robot - ${error}`, 500);
        }
    };


    static async fetch_robot_by_robot_id(robotID: string) {
        try {
            const result = await pgdb.query(`
                SELECT id, name, description, config
                FROM robots
                WHERE id = $1`,
                [robotID]
            );
    
            const rval: RobotObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate robot - ${error}`, 500);
        }
    };


    static async update_robot_by_robot_id(robotID: string, robotData: RobotObjectProps) {
        try {
            let {query, values} = createUpdateQueryPGSQL(
                "robots",
                robotData,
                "id",
                robotID
            );
    
            const result = await pgdb.query(query, values);

            const rval: RobotObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update robot - ${error}`, 500);
        }
    };


    static async delete_robot_by_robot_id(robotID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM robots 
                WHERE id = $1
                RETURNING id`,
            [robotID]);
    
            const rval: RobotObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete robot - ${error}`, 500);
        }
    };
}

export default RobotRepo;