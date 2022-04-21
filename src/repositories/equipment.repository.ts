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

interface IDList {
    id?: string
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

    static async fetch_public_equip_by_equip_id(equipID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            query = `
                SELECT id, name, category_id, headline, description, image_url
                FROM equipment
                WHERE id = $1 AND public = TRUE`;
            queryParams.push(equipID);


            const result = await pgdb.query(query, queryParams);
    
            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment by equipment id - ${error}`, 500);
        }
    };

    static async fetch_unrestricted_equip_by_equip_id(equipID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            query = `
                SELECT id, name, category_id, headline, description, image_url, public, configuration
                FROM equipment
                WHERE id = $1`;
            queryParams.push(equipID);

            const result = await pgdb.query(query, queryParams);

            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment by equipment id - ${error}`, 500);
        }
    };

    static async fetch_equip_list_paginated(
        limit: number, 
        offset: number, 
        username: string | null, 
        groupID: string | null, 
        categoryID: string | null, 
        search: string | null) 
    {
        try {
            let idx = 3;
            const joinTables: Array<string> = [];
            const filterParams: Array<any> = ['equipment.public = TRUE'];
            const queryParams: Array<any> = [limit, offset];

            if (username) {
                joinTables.push(`
                    LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id
                    LEFT JOIN userprofile ON userprofile.user_id = user_equipment.user_id
                `)
                filterParams.push(`userprofile.username_clean = $${idx}`);
                queryParams.push(username);
                idx++;
            };

            if (groupID) {
                joinTables.push(`
                    LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
                `)
                filterParams.push(`group_equipment.group_id = $${idx}`);
                queryParams.push(groupID);
                idx++;
            };

            if (categoryID) {
                filterParams.push(`equipment.category_id = $${idx}`);
                queryParams.push(categoryID);
                idx++;
            };

            if (search) {
                filterParams.push(
                    `(equipment.name ILIKE $${idx} OR
                    equipment.headline ILIKE $${idx} OR
                    equipment.description ILIKE $${idx})`,
                );
                queryParams.push(`%${search}%`);
                idx++;
            };

            let query = `
                SELECT 
                    equipment.id AS id, 
                    equipment.name AS name, 
                    equipment.category_id AS category_id, 
                    equipment.headline AS headline
                FROM equipment
                ${joinTables.join(" ")}
                WHERE ${filterParams.join(" AND ")}
                LIMIT $1
                OFFSET $2
            `;

            const result = await pgdb.query(query, queryParams);
    
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
                userID, equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to delete equipment association user -> equipment - ${error}`, 500);
        }
    };

    static async fetch_equip_by_user_and_equip_id(userID: string, equipIDs: Array<string>) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [userID];
            
            equipIDs.forEach((equipID) => {
                queryParams.push(equipID);
                idxParams.push(`$${idx}`);
                idx++;
            });

            query = `
                SELECT id, name
                FROM equipment
                RIGHT JOIN user_equipment
                ON equipment.id = user_equipment.equip_id
                WHERE user_equipment.user_id = $1 AND user_equipment.equip_id IN (${idxParams.join(', ')})`;
            
            const result = await pgdb.query(query, queryParams);

            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment with target user & equip id combination - ${error}`, 500);
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

    static async fetch_public_equip_list_by_user_id(userID: string, limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT
                    equipment.id AS id,
                    equipment.name AS name,
                    equipment.headline AS headline,
                    equipment.description AS description,
                    equipment.image_url AS image_url,
                    equipment.category_id AS category_id
                FROM equipment
                LEFT JOIN user_equipment ON equipment.id = user_equipment.equip_id
                WHERE user_equipment.user_id = $1 AND equipment.public = TRUE
                LIMIT $2
                OFFSET $3`,
                [userID, limit, offset]
            );
    
            const rval: Array<EquipObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equip - ${error}`, 500);
        }
    };

    static async fetch_unrestricted_equip_list_by_user_id(userID: string, limit: number, offset: number) {
        try {
            const result = await pgdb.query(`
                SELECT
                    equipment.id AS id,
                    equipment.name AS name,
                    equipment.headline AS headline,
                    equipment.description AS description,
                    equipment.image_url AS image_url,
                    equipment.category_id AS category_id
                FROM equipment
                LEFT JOIN user_equipment ON equipment.id = user_equipment.equip_id
                WHERE user_equipment.user_id = $1
                LIMIT $2
                OFFSET $3`,
                [userID, limit, offset]
            );
    
            const rval: Array<EquipObjectProps> | undefined = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equip - ${error}`, 500);
        }
    };

    static async delete_equip_by_user_id(userID: Array<IDList>) {
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
                DELETE FROM equipment
                WHERE equipment.id IN (
                    SELECT equipment.id FROM equipment
                    LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id
                    WHERE user_equipment.user_id IN  (${idxParams.join(', ')})
                )`;
            
            // console.log("Delete Equip by UserID Called");
            // console.log(query);
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - ${this.caller} - ${error}`, 500);
        }
    };

    static async delete_user_equip_by_user_id(userID: Array<IDList>) {
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
                DELETE FROM user_equipment
                WHERE user_equipment.user_id IN (${idxParams.join(', ')})`;
            
            // console.log("Delete User Equip by UserID Called");
            // console.log(query);
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_user_equip_by_user_id - ${error}`, 500);
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
            throw new ExpressError(`Server Error - associate_group_to_equip - ${error}`, 500);
        }
    };

    static async disassociate_group_from_equip(groupID: string, equipID: string) {
        try {
            const result = await pgdb.query(
                `DELETE FROM group_equipment
                WHERE group_id = $1 AND equip_id = $2
                RETURNING group_id, equip_id`,
            [
                groupID, equipID
            ]);
            
            const rval = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`Server Error - disassociate_group_from_equip - ${error}`, 500);
        }
    };

    static async fetch_equip_by_group_and_equip_id(groupID: string, equipIDs: Array<string>) {
        try {
            let idx = 2;
            const idxParams: Array<string> = [];
            let query: string;
            const queryParams: Array<any> = [groupID];
            
            equipIDs.forEach((equipID) => {
                queryParams.push(equipID);
                idxParams.push(`$${idx}`);
                idx++;
            });

            query = `
                SELECT id, name
                FROM equipment
                RIGHT JOIN group_equipment
                ON equipment.id = group_equipment.equip_id
                WHERE group_equipment.group_id = $1 AND group_equipment.equip_id IN (${idxParams.join(', ')})`;
            
            const result = await pgdb.query(query, queryParams);

            return result.rows;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment with target group & equip id combination - ${error}`, 500);
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
            throw new ExpressError(`Server Error - fetch_equip_by_group_id - ${error}`, 500);
        }
    };

    static async fetch_group_by_equip_id(equipID: string) {
        try {
            let query: string;
            let queryParams: Array<any> = [];

            query = `
                SELECT 
                    sitegroups.id AS id, 
                    sitegroups.name AS name, 
                    sitegroups.image_url AS image_url
                FROM sitegroups
                LEFT JOIN group_equipment
                ON group_equipment.group_id = sitegroups.id
                WHERE group_equipment.equip_id = $1`
            queryParams.push(equipID);

            const result = await pgdb.query(query, queryParams);
    
            const rval: EquipObjectProps | undefined = result.rows[0];
            return rval;
        } catch (error) {
            throw new ExpressError(`Server Error - fetch_group_by_equip_id - ${error}`, 500);
        }
    };

    static async delete_equip_by_group_id(groupID: Array<IDList>) {
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
                DELETE FROM equipment
                WHERE equipment.id IN (
                    SELECT equipment.id FROM equipment
                    LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
                    WHERE group_equipment.group_id IN (${idxParams.join(', ')})
                )`;
            
            // console.log("Delete Equip by UserID Called");
            // console.log(query);
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_equip_by_group_id - ${error}`, 500);
        }
    };

    static async delete_group_equip_by_group_id(groupID: Array<IDList>) {
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
                DELETE FROM group_equipment
                WHERE group_equipment.group_id IN (${idxParams.join(', ')})`;
            
            // console.log("Delete User Equip by UserID Called");
            // console.log(query);
            await pgdb.query(query, queryParams);

            return true;
        } catch (error) {
            throw new ExpressError(`Server Error - delete_group_equip_by_group_id - ${error}`, 500);
        }
    };


    //  ____   ___   ___  __  __ 
    // |  _ \ / _ \ / _ \|  \/  |
    // | |_) | | | | | | | |\/| |
    // |  _ <| |_| | |_| | |  | |
    // |_| \_\\___/ \___/|_|  |_|
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

    static async fetch_equip_rooms_by_equip_id(equipIDs: Array<string>, filterRoomsPublic: boolean, filterEquipPublic: boolean) {
        try {
            let idx = 1;
            const idxParams: Array<string> = [];
            const queryParams: Array<any> = [];
            
            equipIDs.forEach((equipID) => {
                queryParams.push(equipID);
                idxParams.push(`$${idx}`);
                idx++;
            });

            const filterBuilder = [`room_equipment.equip_id IN (${idxParams.join(', ')})`]

            if (filterRoomsPublic === true) {
                filterBuilder.push('rooms.public = TRUE');
            };

            if (filterEquipPublic === true) {
                filterBuilder.push('equipment.public = TRUE')
            };

            const query = `
                SELECT 
                    rooms.id AS id, 
                    rooms.name AS name,
                    rooms.image_url AS image_url,
                    room_categories.name AS category_name
                FROM rooms
                RIGHT JOIN room_equipment
                ON rooms.id = room_equipment.room_id
                LEFT JOIN equipment
                ON equipment.id = room_equipment.equip_id
                LEFT JOIN room_categories
                ON room_categories.id = rooms.category_id
                WHERE ${filterBuilder.join(' AND ')}`;

            // const queryParams = [equipID];

            // console.log(query);

            const result = await pgdb.query(query, queryParams);
    
            const rval = result.rows;
            return rval;
        } catch (error) {
            throw new ExpressError(`An Error Occured: Unable to locate equipment rooms by equip id - ${error}`, 500);
        }
    };
}

export default EquipmentRepo;