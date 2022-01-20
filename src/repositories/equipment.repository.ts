import ExpressError from "../utils/expresError";
import createUpdateQueryPGSQL from "../utils/createUpdateQueryPGSQL";
import pgdb from "../databases/postgreSQL/pgdb";


export interface EquipObjectProps {
    id?: string,
    name?: string,
    category_id?: string,
    headline?: string,
    description?: string,
    public?: boolean,
    config?: object 
}


class EquipmentRepo {
    static async create_new_equip(equipData: EquipObjectProps) {
        try {
            let queryColumns: Array<string> = [];
            let queryColIdxs: Array<string> = [];
            let queryParams: Array<any> = [];
            
            let idx = 1;
            for (const key in equipData) {
                if (equipData[key] !== undefined) {
                    queryColumns.push(key);
                    queryColIdxs.push(`$${idx}`);
                    queryParams.push(equipData[key]);
                    idx++;
                }
            };

            const query = `
                INSERT INTO equipment 
                    (${queryColumns.join(",")}) 
                VALUES (${queryColIdxs.join(",")}) 
                RETURNING id, name, category_id, headline, description, public, configuration`;

            const result = await pgdb.query(query, queryParams);
            
            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create new equipment - ${error}`, 500);
        }
    };

    static async fetch_equip_by_equip_id(equipID: string, equipPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (equipPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline, description, public, configuration
                    FROM equipment
                    WHERE id = $1 AND public = $2`;
                queryParams.push(equipID, equipPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline, description, public, configuration
                    FROM equipment
                    WHERE id = $1`;
                queryParams.push(equipID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment by equipment id - ${error}`, 500);
        }
    };

    static async fetch_equip_list_paginated(limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT id, name, category_id, headline
                FROM equipment
                WHERE equipment.public = TRUE
                LIMIT $1
                OFFSET $2`,
                [limit, offset]
            );
    
            const rval: Array<EquipObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment - ${error}`, 500);
        }
    };

    static async update_equip_by_equip_id(equipID: string, equipData: EquipObjectProps) {
        try {
            let {query, values} = createUpdateQueryPGSQL(
                "equipment",
                equipData,
                "id",
                equipID
            );
    
            const result = await pgdb.query(query, values);

            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to update equipment - ${error}`, 500);
        }
    };

    static async delete_equip_by_equip_id(equipID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM equipment 
                WHERE id = $1
                RETURNING id`,
            [equipID]);
    
            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment - ${error}`, 500);
        }
    };


    //  _   _ ____  _____ ____  
    // | | | / ___|| ____|  _ \ 
    // | | | \___ \|  _| | |_) |
    // | |_| |___) | |___|  _ < 
    //  \___/|____/|_____|_| \_\
    static async associate_user_to_equip(userID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO user_equipment 
                    (user_id, equip_id) 
                VALUES ($1, $2) 
                RETURNING user_id, equip_id`,
            [
                userID,
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create equipment association user -> equipment - ${error}`, 500);
        }
    };

    static async disassociate_user_from_equip(userID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM user_equipment
                WHERE user_id = $1 AND equip_id = $2
                RETURNING user_id, equip_id`,
            [
                userID,
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment association user -> equipment - ${error}`, 500);
        }
    };

    static async fetch_equip_by_user_id(userID: string, equipPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (equipPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline
                    FROM equipment
                    RIGHT JOIN user_equipment
                    ON equipment.id = user_equipment.equip_id
                    WHERE user_equipment.user_id = $1 AND equipment.public = $2`
                queryParams.push(userID, equipPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline, public
                    FROM equipment
                    RIGHT JOIN user_equipment
                    ON equipment.id = user_equipment.equip_id
                    WHERE user_equipment.user_id = $1`;
                queryParams.push(userID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<EquipObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment by user id - ${error}`, 500);
        }
    };

//      ____ ____   ___  _   _ ____  
//     / ___|  _ \ / _ \| | | |  _ \ 
//    | |  _| |_) | | | | | | | |_) |
//    | |_| |  _ <| |_| | |_| |  __/ 
//     \____|_| \_\\___/ \___/|_|    
    static async associate_group_to_equip(groupID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO group_equipment 
                    (group_id, equip_id) 
                VALUES ($1, $2) 
                RETURNING group_id, equip_id`,
            [
                groupID,
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create equipment association group -> equipment - ${error}`, 500);
        }
    };

    static async disassociate_group_from_equip(groupID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM group_equipment
                WHERE group_id = $1 AND equip_id = $2
                RETURNING group_id, equip_id`,
            [
                groupID,
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment association group -> equipment - ${error}`, 500);
        }
    };

    static async fetch_equip_by_group_id(groupID: string, equipPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (equipPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline
                    FROM equipment
                    RIGHT JOIN group_equipment
                    ON equipment.id = group_equipment.equip_id
                    WHERE group_equipment.group_id = $1 AND equipment.public = $2`
                queryParams.push(groupID, equipPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline, public
                    FROM equipment
                    RIGHT JOIN group_equipment
                    ON equipment.id = group_equipment.equip_id
                    WHERE group_equipment.group_id = $1`
                queryParams.push(groupID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<EquipObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment by group id - ${error}`, 500);
        }
    };



    //  ____   ___   ___  __  __ 
    // |  _ \ / _ \ / _ \|  \/  |
    // | |_) | | | | | | | |\/| |
    // |  _ <| |_| | |_| | |  | |
    // |_| \_\\___/ \___/|_|  |_|
    static async associate_room_to_equip(roomID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `INSERT INTO room_equipment 
                    (room_id, equip_id) 
                VALUES ($1, $2) 
                RETURNING room_id, equip_id`,
            [
                roomID,
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to create equipment association room -> equipment - ${error}`, 500);
        }
    };

    static async disassociate_room_from_equip_by_room_equip_id(roomID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM room_equipment
                WHERE room_id = $1 AND equip_id = $2
                RETURNING room_id, equip_id`,
            [
                roomID,
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment association room -> equipment - ${error}`, 500);
        }
    };

    static async disassociate_room_from_equip_by_room_id(roomID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM room_equipment
                WHERE room_id = $1
                RETURNING room_id`,
            [
                roomID
            ]);
            
            const rval = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment associations room -> equipment, all room instances - ${error}`, 500);
        }
    };

    static async disassociate_room_from_equip_by_equip_id(equipID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM room_equipment
                WHERE equip_id = $1
                RETURNING room_id, equip_id`,
            [
                equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment associations room -> equipment, all equipment instances - ${error}`, 500);
        }
    };

    static async fetch_equip_by_room_id(roomID: string, roomPublic?: boolean) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            if (roomPublic !== undefined) {
                query = `
                    SELECT id, name, category_id, headline
                    FROM equipment
                    RIGHT JOIN room_equipment
                    ON equipment.id = room_equipment.equip_id
                    WHERE room_equipment.room_id = $1 AND equipment.public = $2`
                queryParams.push(roomID, roomPublic);
            } else {
                query = `
                    SELECT id, name, category_id, headline
                    FROM equipment
                    RIGHT JOIN room_equipment
                    ON equipment.id = room_equipment.equip_id
                    WHERE room_equipment.room_id = $1`
                queryParams.push(roomID);
            }

            const result = await pgdb.query(query, queryParams);
    
            const rval: Array<EquipObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment by room id - ${error}`, 500);
        }
    };

    static async fetch_equip_rooms_by_equip_id(equipID: string) {
        try {
                const query = `
                    SELECT id, name
                    FROM equipment
                    RIGHT JOIN room_equipment
                    ON equipment.id = room_equipment.equip_id
                    WHERE room_equipment.equip_id = $1`;

                const queryParams = [equipID];

            const result = await pgdb.query(query, queryParams);
    
            const rval = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment rooms by equip id - ${error}`, 500);
        }
    };

    static async fetch_equip_by_group_and_equip_id(groupID: string, equipID: string) {
        try {
            const query = `
                SELECT id, name
                FROM equipment
                RIGHT JOIN group_equipment
                ON equipment.id = group_equipment.equip_id
                WHERE group_equipment.group_id = $1 AND group_equipment.equip_id = $2`;
            
            const queryParams = [groupID, equipID];

            const result = await pgdb.query(query, queryParams);

            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment with target group & equip id combination - ${error}`, 500);
        }
    };

    static async fetch_equip_by_user_and_equip_id(userID: string, equipID: string) {
        try {
            const query = `
                SELECT id, name
                FROM equipment
                RIGHT JOIN user_equipment
                ON equipment.id = user_equipment.equip_id
                WHERE user_equipment.user_id = $1 AND user_equipment.equip_id = $2`;
            
            const queryParams = [userID, equipID];

            const result = await pgdb.query(query, queryParams);

            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment with target user & equip id combination - ${error}`, 500);
        }
    };
}

export default EquipmentRepo;