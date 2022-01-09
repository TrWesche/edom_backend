import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface RoomObjectProps {
    id?: string,
    name?: string,
    category_id?: string,
    headline?: string,
    description?: string,
    public?: boolean,
}


class RoomRepo {
    static async create_new_room(roomData: RoomObjectProps) {
        try {
            let queryColumns: Array<string> = [];
            let queryColIdxs: Array<string> = [];
            let queryParams: Array<any> = [];
            
            let idx = 1;
            for (const key in roomData) {
                if (roomData[key] !== undefined) {
                    queryColumns.push(key);
                    queryColIdxs.push(`$${idx}`);
                    queryParams.push(roomData[key]);
                    idx++;
                }
            };

            const query = `
                INSERT INTO rooms 
                    (${queryColumns.join(",")}) 
                VALUES (${queryColIdxs.join(",")}) 
                RETURNING id, name, category_id, headline, description, public`;

            const result = await pgdb.query(query, queryParams);
            
            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new room - ${error}`, 500);
        }
    };
    
    static async fetch_room_by_room_id(roomID: string, roomPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (roomPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline, description, public
                    FROM rooms
                    WHERE id = $1 AND public = $2`;
                queryParams.push(roomID, roomPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline, description, public
                    FROM rooms
                    WHERE id = $1`;
                queryParams.push(roomID);
            };

            const result = await pgdb.query(query, queryParams);
    
            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate room - ${error}`, 500);
        };
    };

    static async fetch_room_list_paginated(limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT id, name, category_id, headline
                FROM rooms
                LIMIT $1
                OFFSET $2
                WHERE rooms.public = TRUE`,
                [limit, offset]
            );
    
            const rval: Array<RoomObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate rooms - ${error}`, 500);
        }
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


    //  _   _ ____  _____ ____  
    // | | | / ___|| ____|  _ \ 
    // | | | \___ \|  _| | |_) |
    // | |_| |___) | |___|  _ < 
    //  \___/|____/|_____|_| \_\
    static async associate_user_to_room(userID: string, roomID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO user_rooms 
                    (user_id, room_id) 
                VALUES ($1, $2) 
                RETURNING user_id, room_id`,
            [
                userID,
                roomID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create room association user -> room - ${error}`, 500);
        }
    };

    static async disassociate_user_from_room(userID: string, roomID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_rooms
                WHERE user_id = $1 AND room_id = $2
                RETURNING user_id, room_id`,
            [
                userID,
                roomID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete room association user -> room - ${error}`, 500);
        }
    };

    static async fetch_rooms_by_user_id(userID: string, roomPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (roomPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline
                    FROM rooms
                    RIGHT JOIN user_rooms
                    ON rooms.id = user_rooms.equip_id
                    WHERE user_rooms.user_id = $1 AND rooms.public = $2`
                queryParams.push(userID, roomPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline
                    FROM rooms
                    RIGHT JOIN user_rooms
                    ON rooms.id = user_rooms.equip_id
                    WHERE user_rooms.user_id = $1`
                queryParams.push(userID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<RoomObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate rooms by user id - ${error}`, 500);
        }
    };

//      ____ ____   ___  _   _ ____  
//     / ___|  _ \ / _ \| | | |  _ \ 
//    | |  _| |_) | | | | | | | |_) |
//    | |_| |  _ <| |_| | |_| |  __/ 
//     \____|_| \_\\___/ \___/|_|    
    static async associate_group_to_room(groupID: string, roomID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO group_rooms 
                    (group_id, room_id) 
                VALUES ($1, $2) 
                RETURNING user_id, room_id`,
            [
                groupID,
                roomID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create room association group -> room - ${error}`, 500);
        }
    };

    static async disassociate_group_from_room(groupId: string, roomID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM group_rooms
                WHERE group_id = $1 AND room_id = $2
                RETURNING group_id, room_id`,
            [
                groupId,
                roomID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete room association group -> room - ${error}`, 500);
        }
    };

    static async fetch_rooms_by_group_id(groupID: string, roomPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (roomPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline
                    FROM rooms
                    RIGHT JOIN group_rooms
                    ON rooms.id = group_rooms.equip_id
                    WHERE group_rooms.group_id = $1 AND rooms.public = $2`
                queryParams.push(groupID, roomPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline
                    FROM rooms
                    RIGHT JOIN group_rooms
                    ON rooms.id = group_rooms.equip_id
                    WHERE group_rooms.group_id = $1`
                queryParams.push(groupID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<RoomObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate rooms by group id - ${error}`, 500);
        }
    };
}


export default RoomRepo;