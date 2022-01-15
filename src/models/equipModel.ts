// Utility Imports
import ExpressError from "../utils/expresError";

// Schema Imports
import { UserEquipCreateProps } from "../schemas/equipment/userEquipCreateSchema";
import { GroupEquipCreateProps } from "../schemas/equipment/groupEquipCreateSchema";

// Repository Imports
import TransactionRepo from "../repositories/transactionRepository";
import EquipRepo, { EquipObjectProps } from "../repositories/equipment.repository";

class EquipModel {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_user_equip(userID: string, data: UserEquipCreateProps) {
        // Preflight
        if (!data.name || !data.category_id || !data.configuration) {
            throw new ExpressError("Invalid Create Equipment Call", 400);
        };

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Create Equipment in Database
            const equipEntry = await EquipRepo.create_new_equip(data);
            if (!equipEntry?.id) {
                throw new ExpressError("Error while creating new equipment entry", 500);
            };

            // Associate Equipment with Uploading User
            const equipAssoc = await EquipRepo.associate_user_to_equip(userID, equipEntry.id);
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

    static async create_group_equip(groupID: string, data: GroupEquipCreateProps) {
        // Preflight
        if (!data.name || !data.description || !data.config || !data.public) {
            throw new ExpressError("Invalid Create Equipment Call", 400);
        };

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Create Equipment in Database
            const equipEntry = await EquipRepo.create_new_equip(data);
            if (!equipEntry?.id) {
                throw new ExpressError("Error while creating new equipment entry", 500);
            };

            // Associate Equipment with Uploading User
            const equipAssoc = await EquipRepo.associate_group_to_equip(groupID, equipEntry.id);
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
            const equipRooms = await EquipRepo.fetch_equip_rooms_by_equip_id(equipID);
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
    static async retrieve_equip_by_equip_id(equipID: string, equipPublic?: boolean) {
        const equip = await EquipRepo.fetch_equip_by_equip_id(equipID, equipPublic);
        return equip;
    };

    static async retrieve_equip_list_paginated(limit: number, offset: number) {
        const equip = await EquipRepo.fetch_equip_list_paginated(limit, offset);
        return equip;
    };

    static async retrieve_user_equip_by_user_id_public(userID: string) {
        const equip = await EquipRepo.fetch_equip_by_user_id(userID, true);
        return equip;
    };

    static async retrieve_user_equip_by_user_id_all(userID: string) {
        const equip = await EquipRepo.fetch_equip_by_user_id(userID);
        return equip;
    };

    static async retrieve_group_equip_by_group_id_public(groupID: string) {
        const equip = await EquipRepo.fetch_equip_by_group_id(groupID, true);
        return equip;
    };

    static async retrieve_group_equip_by_group_id_all(groupID: string) {
        const equip = await EquipRepo.fetch_equip_by_group_id(groupID);
        return equip;
    };

    static async retrieve_room_equip_by_room_id_public(roomID: string) {
        const equip = await EquipRepo.fetch_equip_by_room_id(roomID, true);
        return equip;
    };

    static async retrieve_room_equip_by_room_id_all(roomID: string) {
        const equip = await EquipRepo.fetch_equip_by_room_id(roomID);
        return equip;
    };



    static async retrieve_equip_user_by_equip_id(robotID: string) {
        //TODO: Check if user profile is public
        //TODO: Return user data
    };

    static async retrieve_equip_group_by_equip_id(robotID: string) {
        //TODO: Check if group is public
        //TODO: Return group data
    };

    static async retrieve_equip_room_by_equip_id(robotID: string) {
        //TODO
    };


    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async modify_user_equip(equipID: string, data: EquipObjectProps) {
        // Perform Equipment Update
        const equip = await EquipRepo.update_equip_by_equip_id(equipID, data);
        if (!equip) {
            throw new ExpressError("Unable to update target user equipment", 400);
        }

        return equip;
    };

    static async modify_group_equip(equipID: string, data: EquipObjectProps) {
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
    static async delete_user_equip(userID: string, equipID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Delete Room -> Equpiment Association Entry(s)
            const roomAssoc = await EquipRepo.disassociate_room_from_equip_by_equip_id(equipID);
            if (!roomAssoc) {
                throw new ExpressError("Error while deleting equipment -> room association", 500);
            };

            // Delete User -> Equipment Association Entry
            const userAssoc = await EquipRepo.disassociate_user_from_equip(userID, equipID);
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
    
    static async delete_group_equip(groupID: string, equipID: string) {
        // Processing
        try {
            await TransactionRepo.begin_transaction();

            // Delete Group -> Equipment Association Entry
            const equipAssoc = await EquipRepo.disassociate_group_from_equip(groupID, equipID);
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