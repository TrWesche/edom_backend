import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface RoomObjectProps {
    id?: string,
    name?: string,
    description?: string,
    public?: boolean
}


class RoomRepo {
    static async create_new_room(roomData: RoomObjectProps) {
        try {
            const result = await pgdb.query(
                `INSERT INTO rooms 
                    (name, description, public) 
                VALUES ($1, $2, $3) 
                RETURNING id, name, description, public`,
            [
                roomData.name,
                roomData.description,
                roomData.public
            ]);
            
            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new room - ${error}`, 500);
        }
    };
    

    static async fetch_room_by_room_id(roomID: string) {
        try {
            const result = await pgdb.query(
                `SELECT id, 
                        name, 
                        description,
                        public
                  FROM rooms
                  WHERE id = $1`,
                  [roomID]
            );
    
            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate room - ${error}`, 500);
        };
    };
    

    static async update_room_by_room_id(roomID: string, roomData: RoomObjectProps) {
        try {
            // Parital Update: table name, payload data, lookup column name, lookup key
            let {query, values} = createUpdateQueryPGSQL(
                "rooms",
                roomData,
                "id",
                roomID
            );
    
            const result = await pgdb.query(query, values);

            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update room - ${error}`, 500);
        }
    };
    
    
    static async delete_room_by_room_id(roomID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM rooms 
                WHERE id = $1
                RETURNING id`,
            [roomID]);
    
            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete room - ${error}`, 500);
        }
    };
}


export default RoomRepo;