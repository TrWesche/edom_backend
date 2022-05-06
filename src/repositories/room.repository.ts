import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";
import { GroupObjectProps } from "./group.repository";


export interface RoomObjectProps {
    id?: string,
    name?: string,
    category_id?: string,
    headline?: string,
    description?: string,
    public?: boolean,
};

interface IDList {
    id?: string
};

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
    
    static async fetch_public_room_by_room_id(roomID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            query = `
                SELECT id, name, category_id, headline, image_url, description
                FROM rooms
                WHERE id = $1 AND public = TRUE`;
            queryParams.push(roomID);

            const result = await pgdb.query(query, queryParams);
    
            const rval: RoomObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate room - ${error}`, 500);
        };
    };

    static async fetch_unrestricted_room_by_room_id(roomID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            query = `
                SELECT id, name, category_id, headline, image_url, description, public
                FROM rooms
                WHERE id = $1`;
            queryParams.push(roomID);

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
                SELECT id, name, category_id, headline, image_url
                FROM rooms
                WHERE rooms.public = TRUE
                LIMIT $1
                OFFSET $2`,
                [limit, offset]
            );
    
            const rval: Array<RoomObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate rooms - ${error}`, 500);
        }
    };

    static async fetch_room_equip_by_room_id(roomID: string, filterRoomsPublic: boolean, filterEquipPublic: boolean) {
        try {
            const filterBuilder = ['room_equipment.room_id = $1']

            if (filterRoomsPublic === true) {
                filterBuilder.push('rooms.public = TRUE');
            };

            if (filterEquipPublic === true) {
                filterBuilder.push('equipment.public = TRUE')
            };

            const query = `
                SELECT 
                    equipment.id AS id, 
                    equipment.name AS name,
                    equipment.image_url AS image_url,
                    equipment_categories.name AS category_name
                FROM rooms
                RIGHT JOIN room_equipment
                ON rooms.id = room_equipment.room_id
                LEFT JOIN equipment
                ON equipment.id = room_equipment.equip_id
                LEFT JOIN equipment_categories
                ON equipment_categories.id = equipment.category_id
                WHERE ${filterBuilder.join(' AND ')}`;

            const queryParams = [roomID];

            // console.log(query);

            const result = await pgdb.query(query, queryParams);
    
            const rval = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate room equipment by room id - ${error}`, 500);
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
            // console.log("Associate User to Room Values:", userID, roomID);
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
            // console.log("Return Value", rval);
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
                    SELECT id, name, category_id, headline, image_url
                    FROM rooms
                    RIGHT JOIN user_rooms
                    ON rooms.id = user_rooms.room_id
                    WHERE user_rooms.user_id = $1 AND rooms.public = $2`
                queryParams.push(userID, roomPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline, image_url
                    FROM rooms
                    RIGHT JOIN user_rooms
                    ON rooms.id = user_rooms.room_id
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

    static async fetch_public_room_list_by_user_id(
        userID: string, 
        limit: number, 
        offset: number,
        categoryID: string | null, 
        search: string | null    
    ) {
        try {
            let idx = 4;
            const filterParams: Array<any> = ['rooms.public = TRUE', 'user_rooms.user_id = $1'];
            const queryParams: Array<any> = [userID, limit, offset];

            if (categoryID) {
                filterParams.push(`rooms.category_id = $${idx}`);
                queryParams.push(categoryID);
                idx++;
            };

            if (search) {
                filterParams.push(
                    `(rooms.name ILIKE $${idx} OR
                        rooms.headline ILIKE $${idx} OR
                        rooms.description ILIKE $${idx})`,
                );
                queryParams.push(`%${search}%`);
                idx++;
            };

            let query = `
                SELECT
                    rooms.id AS id,
                    rooms.name AS name,
                    rooms.headline AS headline,
                    rooms.description AS description,
                    rooms.image_url AS image_url,
                    rooms.category_id AS category_id
                FROM rooms
                LEFT JOIN user_rooms ON rooms.id = user_rooms.room_id
                WHERE ${filterParams.join(" AND ")}
                LIMIT $2
                OFFSET $3
            `;

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<RoomObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate rooms - ${error}`, 500);
        }
    };

    static async fetch_unrestricted_room_list_by_user_id(
        userID: string, 
        limit: number, 
        offset: number,
        categoryID: string | null, 
        search: string | null    
    ) {
        try {
            let idx = 4;
            const filterParams: Array<any> = ['user_rooms.user_id = $1'];
            const queryParams: Array<any> = [userID, limit, offset];

            if (categoryID) {
                filterParams.push(`rooms.category_id = $${idx}`);
                queryParams.push(categoryID);
                idx++;
            };

            if (search) {
                filterParams.push(
                    `(rooms.name ILIKE $${idx} OR
                        rooms.headline ILIKE $${idx} OR
                        rooms.description ILIKE $${idx})`,
                );
                queryParams.push(`%${search}%`);
                idx++;
            };

            let query = `
                SELECT
                    rooms.id AS id,
                    rooms.name AS name,
                    rooms.headline AS headline,
                    rooms.description AS description,
                    rooms.image_url AS image_url,
                    rooms.category_id AS category_id
                FROM rooms
                LEFT JOIN user_rooms ON rooms.id = user_rooms.room_id
                WHERE ${filterParams.join(" AND ")}
                LIMIT $2
                OFFSET $3
            `;

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<RoomObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate rooms - ${error}`, 500);
        }
    };

    static async delete_room_by_user_id(userID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM rooms
                WHERE rooms.id IN (
                    SELECT rooms.id FROM rooms
                    LEFT JOIN user_rooms ON user_rooms.room_id = rooms.id
                    WHERE user_rooms.user_id IN (${idxParams.join(', ')})
                )`;
            
            // console.log(query);
            await pgdb.query(query, queryParams);
            // console.log("Delete Room");

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };

    static async delete_user_room_by_user_id(userID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            userID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM user_rooms
                WHERE user_rooms.user_id IN (${idxParams.join(', ')})`;
            
            // console.log(query);
            await pgdb.query(query, queryParams);
            // console.log("Delete User Room");

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
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
                RETURNING group_id, room_id`,
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

    static async fetch_group_by_room_id(roomID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

                query = `
                    SELECT 
                        sitegroups.id AS id,
                        sitegroups.name AS name,
                        sitegroups.image_url AS image_url
                    FROM sitegroups
                    LEFT JOIN group_rooms
                    ON group_rooms.group_id = sitegroups.id
                    WHERE group_rooms.room_id = $1`
                queryParams.push(roomID);

            const result = await pgdb.query(query, queryParams);
    
            const rval: GroupObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate group id by room id - ${error}`, 500);
        }
    };

    static async fetch_rooms_by_group_id(groupID: string, roomPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (roomPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline, image_url
                    FROM rooms
                    RIGHT JOIN group_rooms
                    ON rooms.id = group_rooms.room_id
                    WHERE group_rooms.group_id = $1 AND rooms.public = $2`
                queryParams.push(groupID, roomPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline, image_url
                    FROM rooms
                    RIGHT JOIN group_rooms
                    ON rooms.id = group_rooms.room_id
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

    static async delete_room_by_group_id(groupID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            groupID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM rooms
                WHERE rooms.id IN (
                    SELECT rooms.id FROM rooms
                    LEFT JOIN group_rooms ON group_rooms.room_id = rooms.id
                    WHERE group_rooms.group_id IN (${idxParams.join(', ')})
                )`;
            
            // console.log(query);
            await pgdb.query(query, queryParams);
            // console.log("Delete Room");

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_room_by_group_id - ${error}`, 500);
        }
    };

    static async delete_group_room_by_group_id(groupID: Array<IDList>) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            groupID.forEach((val) => {
                if (val.id) {
                    queryParams.push(val.id);
                    idxParams.push(`$${idx}`);
                    idx++;
                };
            });

            query = `
                DELETE FROM group_rooms
                WHERE group_rooms.group_id IN (${idxParams.join(', ')})`;
            
            // console.log(query);
            await pgdb.query(query, queryParams);
            // console.log("Delete User Room");

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_group_room_by_group_id - ${error}`, 500);
        }
    };


    static async associate_equip_to_room(equipIDs: Array<string>, roomID: string) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [];
            
            equipIDs.forEach((equipID) => {
                queryParams.push(roomID, equipID);
                idxParams.push(`($${idx}, $${idx+1})`);
                idx+=2;
            });

            query = `
                INSERT INTO room_equipment 
                    (room_id, equip_id) 
                VALUES ${idxParams.join(', ')} 
                RETURNING room_id, equip_id`;
            
            const result = await pgdb.query(query, queryParams);

            return result.rows;
        } catch (error) {
            throw new ExpressError(`Server Error - associate_room_to_equip - ${error}`, 500);
        }
    };

    static async disassociate_equip_from_room(equipIDs: Array<string>, roomID: string) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [roomID];
            
            equipIDs.forEach((equipID) => {
                queryParams.push(equipID);
                idxParams.push(`$${idx}`);
                idx++;
            });

            query = `
                DELETE FROM room_equipment 
                WHERE room_id = $1 AND equip_id IN (${idxParams.join(', ')})
                RETURNING room_id, equip_id`;
            
            const result = await pgdb.query(query, queryParams);

            return result.rows;
        } catch (error) {
            throw new ExpressError(`Server Error - disassociate_room_from_equip - ${error}`, 500);
        }
    };


}


export default RoomRepo;