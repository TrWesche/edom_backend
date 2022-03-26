// Repositories
import RoomRepo, { RoomObjectProps } from "../repositories/room.repository";
import TransactionRepo from "../repositories/transactionRepository";

// Utility Functions
import ExpressError from "../utils/expresError";
import EquipmentRepo from "../repositories/equipment.repository";
import { RoomCreateProps } from "../schemas/room/roomCreateSchema";


class RoomModel {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_user_room(data: RoomCreateProps) {
        // Preflight
        if (!data.name || !data.category_id) {
            throw new ExpressError("Invalid Create Room Call", 400);
        }

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            const dbEntryProps = {
                name: data.name,
                category_id: data.category_id,
                headline: data.headline,
                description: data.description,
                image_url: data.image_url,
                public: data.public
            };

            // Create Room in Database
            const roomEntry = await RoomRepo.create_new_room(dbEntryProps);
            if (!roomEntry?.id) {
                throw new ExpressError("Error while creating new room entry", 500);
            }

            // Associate Room with User
            const roomAssoc = await RoomRepo.associate_user_to_room(data.ownerid, roomEntry.id);
            if (!roomAssoc?.user_id) {
                throw new ExpressError("Error while associating user to room entry", 500);
            }

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return roomEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_group_room(data: RoomCreateProps) {
        // Preflight
        if (!data.name || !data.category_id) {
            throw new ExpressError("Invalid Create Room Call", 400);
        }

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            const dbEntryProps = {
                name: data.name,
                category_id: data.category_id,
                headline: data.headline,
                description: data.description,
                image_url: data.image_url,
                public: data.public
            };

            // Create Room in Database
            const roomEntry = await RoomRepo.create_new_room(dbEntryProps);
            if (!roomEntry?.id) {
                throw new ExpressError("Error while creating new room entry", 500);
            }

            // Associate Room with User
            const roomAssoc = await RoomRepo.associate_group_to_room(data.ownerid, roomEntry.id);
            if (!roomAssoc?.room_id) {
                throw new ExpressError("Error while associating group to room entry", 500);
            }

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return roomEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };
    

    /*   ____  _____    _    ____  
        |  _ \| ____|  / \  |  _ \ 
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/ 
    */
    static async retrieve_room_by_room_id(roomID: string, accessType: string) {
        let room;
        switch (accessType) {
            case "public":
                room = await RoomRepo.fetch_public_room_by_room_id(roomID);
                break;
            case "elevated":
                room = await RoomRepo.fetch_unrestricted_room_by_room_id(roomID);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    

        return room;
    };

    static async retrieve_room_group_by_room_id(roomID: string) {
        const room = await RoomRepo.fetch_group_by_room_id(roomID);
        return room;
    };

    static async retrieve_room_list_paginated(limit: number, offset: number) {
        const rooms = await RoomRepo.fetch_room_list_paginated(limit, offset);
        return rooms;
    };

    static async retrieve_user_rooms_by_user_id_public(userID: string) {
        const rooms = await RoomRepo.fetch_rooms_by_user_id(userID, true);
        return rooms;
    };

    static async retrieve_user_rooms_by_user_id_all(userID: string) {
        const rooms = await RoomRepo.fetch_rooms_by_user_id(userID);
        return rooms;
    };

    static async retrieve_group_rooms_by_group_id_public(groupID: string) {
        const rooms = await RoomRepo.fetch_rooms_by_group_id(groupID, true);
        return rooms;
    };

    static async retrieve_group_rooms_by_group_id_all(groupID: string) {
        const rooms = await RoomRepo.fetch_rooms_by_group_id(groupID);
        return rooms;
    };

    static async retrieve_user_rooms_list_by_user_id(userID: string, accessType: string, limit: number, offset: number) {
        let rooms;
        switch (accessType) {
            case "public":
                rooms = await RoomRepo.fetch_public_room_list_by_user_id(userID, limit, offset);
                break;
            case "user":
                rooms = await RoomRepo.fetch_unrestricted_room_list_by_user_id(userID, limit, offset);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    

        return rooms;
    };

    static async retrieve_room_equip_by_room_id(roomID: string, accessType: string) {
        let equip;

        switch (accessType) {
            case "full":
                equip = await RoomRepo.fetch_room_equip_by_room_id(roomID, false, false);
                break;
            case "elevatedEquip":
                equip = await RoomRepo.fetch_room_equip_by_room_id(roomID, true, false);
                break;
            case "elevatedRoom":
                equip = await RoomRepo.fetch_room_equip_by_room_id(roomID, false, true);
                break;
            case "public":
                equip = await RoomRepo.fetch_room_equip_by_room_id(roomID, true, true);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    

        return equip;
    };


    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async modify_room(roomID: string, data: RoomObjectProps) {
        // Perform Room Update
        const room = await RoomRepo.update_room_by_room_id(roomID, data);
        if (!room) {
            throw new ExpressError("Unable to update target user room", 400);
        };

        return room;
    };

    // static async modify_group_room(roomID: string, data: RoomObjectProps) {
    //     // Perform Room Update
    //     const room = await RoomRepo.update_room_by_room_id(roomID, data);
    //     if (!room) {
    //         throw new ExpressError("Unable to update target group room", 400);
    //     };

    //     return room;
    // };


    /*   ____  _____ _     _____ _____ _____ 
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|  
        | |_| | |___| |___| |___  | | | |___ 
        |____/|_____|_____|_____| |_| |_____|
    */
    static async delete_user_room(userID: string, roomID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Delete User -> Room Association Entry
            const roomAssoc = await RoomRepo.disassociate_user_from_room(userID, roomID);
            if (!roomAssoc?.room_id) {
                throw new ExpressError("Error while disassociating user from room entry", 500);
                
            };

            // Delete Equipment -> Room Associations Entries
            const equipAssoc = await EquipmentRepo.disassociate_room_from_equip_by_room_id(roomID);
            if (!equipAssoc) {
                throw new ExpressError("Error while disassociating equipment from room entry", 500);
            };

            // Delete Room Entry
            const room = await RoomRepo.delete_room_by_room_id(roomAssoc.room_id);
            if (!room?.id) {
                throw new ExpressError("Error while deleting room entry", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return room;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };

    static async delete_group_room(groupID: string, roomID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Delete Equip -> Room Association Entries
            const equipAssoc = await EquipmentRepo.disassociate_room_from_equip_by_room_id(roomID);

            // Delete Group -> Room Association Entry
            const roomAssoc = await RoomRepo.disassociate_group_from_room(groupID, roomID);
            if (!roomAssoc?.room_id) {
                throw new ExpressError("Error while disassociating group from room entry", 500);
                
            };

            // Delete Room Entry
            const room = await RoomRepo.delete_room_by_room_id(roomAssoc.room_id);
            if (!room?.id) {
                throw new ExpressError("Error while deleting room entry", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return room;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };




    // Equip
    static async create_equip_room_assignment(equipID: string, roomID: string) {
        try {
            const data = await RoomRepo.associate_equip_to_room(equipID, roomID)
            if (!data) {
                throw new ExpressError("Unable to create association between equipment and room", 400);
            };
            return data;    
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        };
    };
}

export default RoomModel;