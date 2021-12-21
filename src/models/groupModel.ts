// Repositories
import GroupRepo, { GroupObjectProps } from "../repositories/group.repository";
import GroupPermissionsRepo, { GroupPermProps, GroupRolePermsProps, GroupRoleProps } from "../repositories/groupPermissions.repository";

// Schemas
import { GroupCreateProps } from "../schemas/group/groupCreateSchema";

// Utils
import ExpressError from "../utils/expresError";
import TransactionRepo from "../repositories/transactionRepository";


class GroupModel {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_group(groupData: GroupCreateProps) {
        // if (!data.name) {
        //     throw new ExpressError("Invalid Create Group Call", 400);
        // };

        const group = GroupRepo.create_new_group(groupData);
        // TODO: When creating a new group it should be immediately populated with default roles & permissions
        //       This may be a good place to use something like a stored procedure?

        return group;
    };

    static async create_role(groupID: string, name: string) {
        // if (!groupID || !name) {
        //     throw new ExpressError("Invalid Create Group Role Call", 400);
        // };

        const roleData: GroupRoleProps = {
            group_id: groupID,
            name: name
        };

        const role = GroupPermissionsRepo.create_new_role(roleData);
        return role;
    };

    static async create_permission(groupID: string, name: string) {
        const permissionData: GroupPermProps = {
            id: groupID,
            name: name
        }

        const permission = GroupPermissionsRepo.create_new_permission(permissionData);
        return permission;
    };

    static async create_role_permissions(roleID: string, permissionIDs: Array<string>) {
        // if (!roleID || !name) {
        //     throw new ExpressError("Invalid Create Group Role Permissions Call", 400);
        // };

        try {
            await TransactionRepo.begin_transaction();
            let rolePermissions: Array<GroupRolePermsProps> | undefined;

            if (permissionIDs.length > 0) {
                rolePermissions = await GroupPermissionsRepo.create_role_permissions(roleID, permissionIDs);
            } else {
                throw new ExpressError("Error encountered when creating new role permissions", 400);
            }

            if (rolePermissions && rolePermissions.length > 0 && rolePermissions[0].permission_id) {
                await TransactionRepo.commit_transaction();
            }
    
            return rolePermissions;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
        }
    };

    

    /*   ____  _____    _    ____  
        |  _ \| ____|  / \  |  _ \ 
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/ 
    */
    static async retrieve_group_by_group_id(groupID: string) {
        const group = GroupRepo.fetch_group_by_group_id(groupID);
        return group;
    };

    static async retrieve_roles_by_group_id(groupID: string) {
        const roles = GroupPermissionsRepo.fetch_role_by_role_id(groupID);
        return roles;
    };
    
    static async retrieve_role_permissions_by_role_id(roleID: string) {
        const permissions = GroupPermissionsRepo.fetch_role_permissions_by_role_id(roleID);
        return permissions;
    };



    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async modify_group(groupID: string, groupData: GroupCreateProps) {
        // if (!groupID) {
        //     throw new ExpressError("Error: Group ID not provided", 400);
        // };

        // Perform Group Update
        const group = await GroupRepo.update_group_by_group_id(groupID, groupData);
        if (!group) {
            throw new ExpressError("Unable to update target group", 400);
        };

        return group;
    };


    /*   ____  _____ _     _____ _____ _____ 
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|  
        | |_| | |___| |___| |___  | | | |___ 
        |____/|_____|_____|_____| |_| |_____|
    */
    static async delete_group(groupID: string) {
        // if (!groupID) {
        //     throw new ExpressError("Error: Group ID not provided", 400);
        // };

        const group = await GroupRepo.delete_group_by_group_id(groupID);
        if (!group) {
            throw new ExpressError("Unable to delete target group", 400);
        };

        return group;
    };

    static async delete_role(roleID: string) {
        // if (!roleID) {
        //     throw new ExpressError("Error: Role ID not provided", 400);
        // };

        const role = await GroupPermissionsRepo.delete_role_by_role_id(roleID);
        if (!role) {
            throw new ExpressError("Unable to delete target role", 400);
        };

        return role;
    };

    static async delete_permission(permID: string) {
        // if (!permID) {
        //     throw new ExpressError("Error: Permission ID not provided", 400);
        // };

        const permission = await GroupPermissionsRepo.delete_permission_by_permission_id(permID);
        if (!permission) {
            throw new ExpressError("Unable to delete target permission", 400);
        };

        return permission;
    };

    static async delete_role_pemission(roleID: string, permID: string) {
        const permission = await GroupPermissionsRepo.delete_role_permissions_by_role_permission_ids(roleID, permID);
        if (!permission) {
            throw new ExpressError("Unable to delete target role permission", 400);
        };

        return permission;
    };
}

export default GroupModel;