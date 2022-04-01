// Repositories
import GroupRepo, { GroupObjectProps } from "../repositories/group.repository";
import GroupPermissionsRepo, { GroupPermProps, GroupRolePermsProps, GroupRoleProps } from "../repositories/groupPermissions.repository";

// Schemas
import { GroupCreateProps } from "../schemas/group/groupCreateSchema";

// Utils
import ExpressError from "../utils/expresError";
import TransactionRepo from "../repositories/transactionRepository";
import EquipmentRepo from "../repositories/equipment.repository";
import RoomRepo from "../repositories/room.repository";

// TODO:  Alot of the queries in here would be better off to be written in stored procedures to minimize the amount of back and forth between
// the database server and the front end.

class GroupModel {
    /*    ____ ____  _____    _  _____ _____ 
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|  
        | |___|  _ <| |___ / ___ \| | | |___ 
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    static async create_group(data: GroupCreateProps) {
        // Preflight
        if (!data.name) {
            throw new ExpressError("Invalid Create Equipment Call", 400);
        };

        // Processing
        try {
            await TransactionRepo.begin_transaction();

            const dbEntryProps = {
                name: data.name,
                headline: data.headline,
                description: data.description,
                image_url: data.image_url,
                location: data.location,
                public: data.public
            };

            // Create Equipment in Database
            const groupEntry = await GroupRepo.create_new_group(dbEntryProps);
            if (!groupEntry?.id) {
                throw new ExpressError("Error while creating new group entry", 500);
            };

            // Populate Standard Group Roles
            const groupRoles = await GroupPermissionsRepo.create_roles_init_new_group(groupEntry.id);
            if (!groupRoles[0]?.id) {
                throw new ExpressError("Error while creating group role entries for new group", 500);
            };

            // Populate Permissions on Newly Created Group Roles
            const groupPermissions = await GroupPermissionsRepo.create_role_permissions_for_new_group(groupEntry.id);
            if (!groupPermissions[0]?.grouprole_id) {
                throw new ExpressError("Error while creating group role permission entries for new group", 500);
            };

            const ownerPermission = await GroupPermissionsRepo.fetch_role_by_role_name("owner", groupEntry.id);
            if (!ownerPermission?.id) {
                throw new ExpressError("Error while fetching group owner permission entry for new group", 500);
            };

            // Associate User to Group
            const userGroup = await GroupRepo.associate_user_to_group([data.ownerid], groupEntry.id);
            if (!userGroup) {
                throw new ExpressError("Error while associating user to group", 500);
            };

            // Associate Equipment with Uploading User
            const userAssoc = await GroupPermissionsRepo.create_user_group_role_by_role_id([data.ownerid], ownerPermission.id);
            if (!userAssoc[0]?.grouprole_id) {
                throw new ExpressError("Error assigning user role to user", 500);
            };

            // Commit to Database
            await TransactionRepo.commit_transaction();

            return groupEntry;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_role(groupID: string, name: string) {
        const roleData: GroupRoleProps = {
            group_id: groupID,
            name: name
        };

        const role = GroupPermissionsRepo.create_role(roleData);
        return role;
    };

    static async create_role_permissions(permissionList: Array<GroupRolePermsProps>) {
        // if (!roleID || !name) {
        //     throw new ExpressError("Invalid Create Group Role Permissions Call", 400);
        // };

        try {
            await TransactionRepo.begin_transaction();
            let rolePermissions: Array<GroupRolePermsProps> | undefined;

            if (permissionList.length > 0) {
                rolePermissions = await GroupPermissionsRepo.create_role_permissions(permissionList);
            } else {
                throw new ExpressError("Error encountered when creating new role permissions", 400);
            }

            if (rolePermissions && rolePermissions.length > 0 && rolePermissions[0].grouppermission_id) {
                await TransactionRepo.commit_transaction();
            }
    
            return rolePermissions;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
        }
    };

    static async create_group_user(groupID: string, userIDs: Array<string>) {
        try {
            await TransactionRepo.begin_transaction();

            const userGroup = await GroupRepo.associate_user_to_group(userIDs, groupID);
            if (!userGroup) {
                throw new ExpressError("Error while associating user to group", 500);
            };

            const defaultRole = await GroupPermissionsRepo.fetch_role_by_role_name("user", groupID);
            if (!defaultRole?.id) {
                throw new ExpressError("Error while fetching default role for target group", 500);
            };

            const userRole = await GroupPermissionsRepo.create_user_group_role_by_role_id(userIDs, defaultRole.id);
            if (!userRole) {
                throw new ExpressError("Error while assinging default role to target user", 500);
            };

            await TransactionRepo.commit_transaction();
            return userRole;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };
    
    static async create_invite_group_to_user(groupID: string, userIDs: Array<string>) {
        try {
            const userInvite = await GroupRepo.create_invite_group_to_user(userIDs, groupID);
            if (!userInvite) {
                throw new ExpressError("Error while inviting user to group", 500);
            };

            return userInvite;
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_group_user_role(roleID: string, userIDs: Array<string>) {
        const userRole = await GroupPermissionsRepo.create_user_group_role_by_role_id(userIDs, roleID);
        if (!userRole) {
            throw new ExpressError("Error while assinging default role to target user", 500);
        };

        return userRole;
    };

    /*   ____  _____    _    ____  
        |  _ \| ____|  / \  |  _ \ 
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/ 
    */
    static async retrieve_group_by_group_id(groupID: string, accessType: string) {
        let group;
        switch (accessType) {
            case "public":
                group = await GroupRepo.fetch_public_group_by_group_id(groupID);
                break;
            case "elevated":
                group = await GroupRepo.fetch_unrestricted_group_by_group_id(groupID);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    
        
        return group;
        // const group = GroupRepo.fetch_group_by_group_id(groupID);
        // return group;
    };

    static async retrieve_group_list_paginated(limit: number, offset: number) {
        const groups = await GroupRepo.fetch_group_list_paginated(limit, offset);
        return groups;
    };

    static async retrieve_user_groups_list_by_user_id(userID: string, accessType: string, limit: number, offset: number) {
        let groups;
        switch (accessType) {
            case "elevated":
                groups = await GroupRepo.fetch_unrestricted_group_list_by_user_id(userID, limit, offset);
                break;
            case "public":
                groups = await GroupRepo.fetch_public_group_list_by_user_id(userID, limit, offset);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    
        
        return groups;
    };

    static async retrieve_roles_by_group_id(groupID: string) {
        const roles = GroupPermissionsRepo.fetch_roles_by_group_id(groupID);
        return roles;
    };
    
    static async retrieve_permissions() {
        const permissions = GroupPermissionsRepo.fetch_permissions();
        return permissions;
    };

    static async retrieve_users_by_group_id(groupID: string, accessType: string) {
        let users;
        switch (accessType) {
            case "full":
                users = await GroupRepo.fetch_group_users_by_group_id(groupID, false);
                break;
            case "public":
                users = await GroupRepo.fetch_group_users_by_group_id(groupID, true);
                break;
            default:
                throw new ExpressError("Server Configuration Error", 500);
        }    
        
        return users;
    };

    static async retrieve_role_permissions_by_role_id(groupID: string, roleID: string) {
        const permissions = GroupPermissionsRepo.fetch_role_permissions_by_role_id(groupID, roleID);
        return permissions;
    };

    static async retrieve_user_roles_by_user_id(userID: string, groupID: string) {
        const roles = GroupPermissionsRepo.fetch_user_group_roles_by_user_id(userID, groupID);
        return roles;
    };

    static async retrieve_group_membership_requests(groupID: string, usernames: Array<string>) {
        const users = await GroupRepo.fetch_member_requests_by_gid_usernames(groupID, usernames);
        return users;
    };

    // static async retrieve_user_permissions_by_user_id(userID: string) {
    //     const permissions = GroupPermissionsRepo.fetch_user_group_permissions_by_user_id(userID);
    //     return permissions;
    // };

    /*   _   _ ____  ____    _  _____ _____ 
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|  
        | |_| |  __/| |_| / ___ \| | | |___ 
         \___/|_|   |____/_/   \_\_| |_____|
    */
    static async modify_group(groupID: string, groupData: GroupObjectProps) {
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
        try {
            await TransactionRepo.begin_transaction();

            const groupList = [{id: groupID}];

            await EquipmentRepo.delete_equip_by_group_id(groupList);
            await EquipmentRepo.delete_group_equip_by_group_id(groupList);
    
            await RoomRepo.delete_room_by_group_id(groupList);
            await RoomRepo.delete_group_room_by_group_id(groupList);
    
            await GroupRepo.delete_group_user_roles_by_group_id(groupList);
            await GroupRepo.delete_group_users_by_group_id(groupList);
    
            await GroupPermissionsRepo.delete_role_permissions_by_group_id(groupList);
            await GroupPermissionsRepo.delete_roles_by_group_id(groupList);
    
            await GroupRepo.delete_groups_by_group_id(groupList);

            await TransactionRepo.commit_transaction();
            return groupList;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        }        
    };

    static async delete_role(roleID: string) {
        try {
            await TransactionRepo.begin_transaction();

            await GroupPermissionsRepo.delete_role_permissions_by_role_id(roleID);

            await GroupPermissionsRepo.delete_user_group_roles_by_role_id(roleID);

            const role = await GroupPermissionsRepo.delete_role_by_role_id(roleID);
            if (!role) {
                throw new ExpressError("Failed to Delete Target Role", 500);
            };

            await TransactionRepo.commit_transaction();
            return role;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        }
    };

    // static async delete_permission(permID: string) {
    //     const permission = await GroupPermissionsRepo.delete_permission_by_permission_id(permID);
    //     if (!permission) {
    //         throw new ExpressError("Unable to delete target permission", 400);
    //     };

    //     return permission;
    // };

    static async delete_role_pemission(roleID: string, permID: string) {
        const permission = await GroupPermissionsRepo.delete_role_permission_by_role_permission_id(roleID, permID);
        if (!permission) {
            throw new ExpressError("Unable to delete target role permission", 500);
        };

        return permission;
    };

    static async delete_group_user(groupID: string, userID: string) {
        try {
            await TransactionRepo.begin_transaction();

            const roles = await GroupPermissionsRepo.delete_user_group_roles_by_user_id(userID);
            if (!roles) {
                throw new ExpressError("Failed to Delete Roles Associated with Target User", 500);
            };
            
            const groupUser = await GroupRepo.disassociate_user_from_group(userID, groupID);
            if (!groupUser) {
                throw new ExpressError("Failed to Disassociate User From Target Group", 500);
            };

            await TransactionRepo.commit_transaction();
            return groupUser;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        }
    };

    static async delete_group_user_role(roleID: string, userID: string) {
        const roles = await GroupPermissionsRepo.delete_user_group_role_by_user_and_role_id(userID, roleID);
        if (!roles) {
            throw new ExpressError("Failed to Delete User Role Associated with Target User", 500);
        };

        return roles;
    };

}

export default GroupModel;