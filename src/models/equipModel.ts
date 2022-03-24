// Utility Imports
import ExpressError from "../utils/expresError";

// Schema Imports
import { UserEquipCreateProps } from "../schemas/equipment/userEquipCreateSchema";
import { GroupEquipCreateProps } from "../schemas/equipment/groupEquipCreateSchema";

// Repository Imports
import TransactionRepo from "../repositories/transactionRepository";
import EquipRepo, { EquipObjectProps } from "../repositories/equipment.repository";
import { EquipCreateProps } from "../schemas/equipment/equipCreateSchema";

class EquipModel {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_user_equip(data: EquipCreateProps) {
        // Preflight
        if (!data.name || !data.category_id || !data.configuration) {
            throw new ExpressError("Invalid Create Equipment Call", 400);
        };

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            const dbEntryProps = {
                name: data.name,
                category_id: data.category_id,
                headline: data.headline,
                description: data.description,
                image_url: data.image_url,
                configuration: data.configuration,
                public: data.public
            };

            // Create Equipment in Database
            const equipEntry = await EquipRepo.create_new_equip(dbEntryProps);
            if (!equipEntry?.id) {
                throw new ExpressError("Error while creating new equipment entry", 500);
            };

            // Associate Equipment with Uploading User
            const equipAssoc = await EquipRepo.associate_user_to_equip(data.ownerid, equipEntry.id);
            if (!equipAssoc.equip_id) {
                throw new ExpressError("Error while associating user to equipment entry", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return equipEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_group_equip(data: EquipCreateProps) {
        // Preflight
        if (!data.name || !data.category_id || !data.configuration) {
            throw new ExpressError("Invalid Create Equipment Call", 400);
        };

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            const dbEntryProps = {
                name: data.name,
                category_id: data.category_id,
                headline: data.headline,
                description: data.description,
                image_url: data.image_url,
                configuration: data.configuration,
                public: data.public
            };

            // Create Equipment in Database
            const equipEntry = await EquipRepo.create_new_equip(dbEntryProps);
            if (!equipEntry?.id) {
                throw new ExpressError("Error while creating new equipment entry", 500);
            };

            // Associate Equipment with Uploading User
            const equipAssoc = await EquipRepo.associate_group_to_equip(data.ownerid, equipEntry.id);
            if (!equipAssoc.equip_id) {
                throw new ExpressError("Error while associating group to equipment entry", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return equipEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_equip_room_association(roomID: string, equipID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Check for existing room -> equipment associations.
            const equipRooms = await EquipRepo.fetch_equip_rooms_by_equip_id(equipID, false, false);
            if (equipRooms.length > 0) {
                throw new ExpressError("Equipment is already assigned to a room.", 400);
            };

            // Create Equipment Room Association in Database
            const equipEntry = await EquipRepo.associate_room_to_equip(roomID, equipID);
            if (!equipEntry?.room_id) {
                throw new ExpressError("Error while creating new equipment -> room association", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return equipEntry;
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
    static async retrieve_equip_by_equip_id(equipID: string, accessType: string) {
        let equip;
        switch (accessType) {
            case "public":
                equip = await EquipRepo.fetch_public_equip_by_equip_id(equipID);
                break;
            case "elevated":
                equip = await EquipRepo.fetch_unrestricted_equip_by_equip_id(equipID);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    

        return equip;
    };

    static async retrieve_equip_list_paginated(limit: number, offset: number) {
        const equip = await EquipRepo.fetch_equip_list_paginated(limit, offset);
        return equip;
    };


    static async retrieve_user_equip_by_user_id(userID: string, userPublic?: boolean) {
        const equip = await EquipRepo.fetch_equip_by_user_id(userID, userPublic);
        return equip;
    };

    static async retrieve_group_equip_by_group_id(groupID: string, groupPublic?: boolean) {
        const equip = await EquipRepo.fetch_equip_by_group_id(groupID, groupPublic);
        return equip;
    };

    static async retrieve_room_equip_by_room_id(roomID: string, roomPublic?: boolean) {
        const equip = await EquipRepo.fetch_equip_by_room_id(roomID, roomPublic);
        return equip;
    };

    static async retrieve_equip_rooms_by_equip_id(equipID: string, accessType: string) {
        let rooms;

        switch (accessType) {
            case "full":
                rooms = await EquipRepo.fetch_equip_rooms_by_equip_id(equipID, false, false);
                break;
            case "elevatedEquip":
                rooms = await EquipRepo.fetch_equip_rooms_by_equip_id(equipID, true, false);
                break;
            case "elevatedRoom":
                rooms = await EquipRepo.fetch_equip_rooms_by_equip_id(equipID, false, true);
                break;
            case "public":
                rooms = await EquipRepo.fetch_equip_rooms_by_equip_id(equipID, true, true);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    

        return rooms;
    };

    static async retrieve_equip_by_group_and_equip_id(groupID: string, equipID: string) {
        const equip = await EquipRepo.fetch_equip_by_group_and_equip_id(groupID, equipID);
        return equip;
    };

    static async retrieve_equip_by_user_and_equip_id(userID: string, equipID: string) {
        const equip = await EquipRepo.fetch_equip_by_user_and_equip_id(userID, equipID);
        return equip;
    };

    static async retrieve_user_equip_list_by_user_id(userID: string, accessType: string, limit: number, offset: number) {
        let rooms;
        switch (accessType) {
            case "public":
                rooms = await EquipRepo.fetch_public_equip_list_by_user_id(userID, limit, offset);
                break;
            case "user":
                rooms = await EquipRepo.fetch_unrestricted_equip_list_by_user_id(userID, limit, offset);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    

        return rooms;
    };

    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    // static async modify_user_equip(equipID: string, data: EquipObjectProps) {
    //     // Perform Equipment Update
    //     const equip = await EquipRepo.update_equip_by_equip_id(equipID, data);
    //     if (!equip) {
    //         throw new ExpressError("Unable to update target user equipment", 400);
    //     }

    //     return equip;
    // };

    static async modify_equip(equipID: string, data: EquipObjectProps) {
        // Perform Equipment Update
        const equip = await EquipRepo.update_equip_by_equip_id(equipID, data);
        if (!equip) {
            throw new ExpressError("Unable to update target group equipment", 400);
        }

        return equip;
    };


    /*   ____  _____ _     _____ _____ _____ 
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|  
        | |_| | |___| |___| |___  | | | |___ 
        |____/|_____|_____|_____| |_| |_____|
    */
    static async delete_user_equip(equipID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Delete Room -> Equpiment Association Entry(s)
            await EquipRepo.disassociate_room_from_equip_by_equip_id(equipID);

            // Delete User -> Equipment Association Entry
            const userAssoc = await EquipRepo.disassociate_user_from_equip(equipID);
            if (!userAssoc?.equip_id) {
                throw new ExpressError("Error while disassociating user from equipment entry", 500);
            };

            // Delete Equipment Entry
            const equipEntry = await EquipRepo.delete_equip_by_equip_id(userAssoc.equip_id);
            if (!equipEntry?.id) {
                throw new ExpressError("Error while deleting equipment entry", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return equipEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };
    
    static async delete_group_equip(equipID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Delete Room -> Equpiment Association Entry(s)
            await EquipRepo.disassociate_room_from_equip_by_equip_id(equipID);

            // Delete Group -> Equipment Association Entry
            const equipAssoc = await EquipRepo.disassociate_group_from_equip(equipID);
            if (!equipAssoc?.equip_id) {
                throw new ExpressError("Error while disassociating group from equipment entry", 500);
            };

            // Delete Equipment Entry
            const equipEntry = await EquipRepo.delete_equip_by_equip_id(equipAssoc.equip_id);
            if (!equipEntry?.id) {
                throw new ExpressError("Error while deleting equipment entry", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return equipEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };

    static async delete_equip_room_assc_by_room_equip_id(roomID: string, equipID: string) {
        // Processing
        // Delete Equipment Room Association from Database
        const equipEntry = await EquipRepo.disassociate_room_from_equip_by_room_equip_id(roomID, equipID);
        if (!equipEntry?.room_id) {
            throw new ExpressError("Error while deleting equipment -> room association", 500);
        };
        return equipEntry;
    };
}

export default EquipModel;