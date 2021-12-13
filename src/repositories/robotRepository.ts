import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface RobotObjectProps {
    id?: string,
    name?: string,
    description?: string,
    public?: boolean,
    config?: object 
}


class RobotRepository {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_new_robot(robotData: RobotObjectProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO robots 
                    (name, description, public, config) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, name, description, public, config`,
            [
                robotData.name,
                robotData.description,
                robotData.public,
                robotData.config
            ]);
            
            const rval: RobotObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new robot - ${error}`, 500);
        }
    };


    /*   ____  _____    _    ____  
        |  _ \| ____|  / \  |  _ \ 
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/ 
    */
    static async fetch_robot_by_robot_id(robotID: string) {
        try {
            const result = await pgdb.query(`
                SELECT id, name, description, public, config
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


    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async update_robot_by_robot_id(robotID: string, data: RobotObjectProps) {
        try {
            let {query, values} = createUpdateQueryPGSQL(
                "robots",
                data,
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


    /*   ____  _____ _     _____ _____ _____ 
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|  
        | |_| | |___| |___| |___  | | | |___ 
        |____/|_____|_____|_____| |_| |_____|
    */
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

export default RobotRepository;