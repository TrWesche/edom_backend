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
import UserRepo from "../repositories/user.repository";import { group } from "console";

// Note:  Alot of the queries in here would be better off to be written in stored procedures to minimize the amount of back and forth between
// the database server and the express backend.

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

            const ownerPermission = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupEntry.id, ["owner"]);
            if (!ownerPermission) {
                throw new ExpressError("Error while fetching group owner permission entry for new group", 500);
            };

            // Associate User to Group
            const userGroup = await GroupRepo.associate_user_to_group([data.ownerid], groupEntry.id);
            if (!userGroup) {
                throw new ExpressError("Error while associating user to group", 500);
            };

            // Associate Equipment with Uploading User
            const userAssoc = await GroupPermissionsRepo.create_user_group_role_by_uid_role_id([data.ownerid], ownerPermission);
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

    static async create_role_permissions(groupID: string, roleName: string, permNames: Array<string>) {
        try {
            await TransactionRepo.begin_transaction();
            
            const roleID = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, [roleName]);
            if (!roleID || roleID.length < 1 || !roleID[0].id) {throw new ExpressError("Creating Role Permissions Failed - Role Not Found", 400);};

            const permissionIDs = await GroupPermissionsRepo.fetch_perm_id_by_perm_name(permNames);
            if (!permissionIDs || permissionIDs.length < 1) {throw new ExpressError("Creating Role Permissions Failed - Permissions Not Found", 400);};
            
            const rolePermissions = await GroupPermissionsRepo.create_role_permissions(roleID[0].id, permissionIDs);
            
            await TransactionRepo.commit_transaction();
            return rolePermissions;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        }
    };

    static async create_group_user(groupID: string, userIDs: Array<string>) {
        try {
            await TransactionRepo.begin_transaction();

            const userGroup = await GroupRepo.associate_user_to_group(userIDs, groupID);
            if (!userGroup) {
                throw new ExpressError("Error while associating user to group", 500);
            };

            const defaultRoles = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, ["user"]);
            if (!defaultRoles) {
                throw new ExpressError("Error while fetching default role for target group", 500);
            };

            const userRole = await GroupPermissionsRepo.create_user_group_role_by_uid_role_id(userIDs, defaultRoles);
            if (!userRole) {
                throw new ExpressError("Error while assinging default role to target user", 500);
            };

            await GroupRepo.delete_request_user_group(userIDs, groupID);

            await TransactionRepo.commit_transaction();
            return userRole;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        };
    };
    
    static async create_request_group_to_user(groupID: string, userIDs: Array<string>) {
        try {
            const userInvite = await GroupRepo.create_request_group_to_user(userIDs, groupID);
            if (!userInvite) {
                throw new ExpressError("Error while inviting user to group", 500);
            };

            return userInvite;
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_request_user_to_group(groupID: string, userID: string) {
        try {
            const userInvite = await GroupRepo.create_request_user_to_group(userID, groupID);
            if (!userInvite) {
                throw new ExpressError("Error while requesting group membership", 500);
            };

            return userInvite;
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        };
    };

    static async create_group_user_role(groupID: string, roleNames: Array<string>, userIDs: Array<string>) {
        const roleIDs = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, roleNames)
        if (!roleIDs) {
            throw new ExpressError("Error while fetching role ids", 500);
        };  

        const userRole = await GroupPermissionsRepo.create_user_group_role_by_uid_role_id(userIDs, roleIDs);
        if (!userRole) {
            throw new ExpressError("Error while assinging roles to target users", 500);
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

    static async retrieve_user_groups_list_by_user_id(
        userID: string, 
        accessType: string, 
        limit: number, 
        offset: number,
        search: string | null
    ) {
        let groups;
        switch (accessType) {
            case "elevated":
                groups = await GroupRepo.fetch_unrestricted_group_list_by_user_id(userID, limit, offset, search);
                break;
            case "public":
                groups = await GroupRepo.fetch_public_group_list_by_user_id(userID, limit, offset, search);
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

    static async retrieve_role_permissions_by_role_id(groupID: string, rolename: string) {
        const roleIDs = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, [rolename]);
        if (!roleIDs || !roleIDs[0].id) {
            throw new ExpressError("Error while fetching role ids", 500);
        };  

        const permissions = await GroupPermissionsRepo.fetch_role_permissions_by_role_id(groupID, roleIDs[0].id);
        return permissions;
    };

    static async retrieve_user_roles_by_user_id(userID: string, groupID: string) {
        const roles = GroupPermissionsRepo.fetch_user_group_roles_by_user_id(userID, groupID);
        return roles;
    };

    static async retrieve_group_membership_requests_by_username(groupID: string, usernames: Array<string>) {
        const users = await GroupRepo.fetch_member_requests_by_gid_usernames(groupID, usernames);
        return users;
    };

    static async retrieve_group_membership_requests(groupID: string) {
        const users = await GroupRepo.fetch_member_requests_by_group_id(groupID);
        return users;
    };

    static async retrieve_user_id_by_username(username: Array<string>, groupID: string, context?: string) {
        try {
            const userIDListRaw = await UserRepo.fetch_user_id_by_username(username);
            console.log(userIDListRaw);
            let userIDs;

            switch (context) {
                case "user_request_active":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Active User Requests to Groups", 400)};

                    userIDs = await GroupRepo.fetch_active_member_requests_by_uid_gid(userIDListRaw, groupID, true, false);
                    break;
                case "user_request_permitted":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Permitted User to Group Requests", 400)};
                    
                    userIDs = await GroupRepo.fetch_request_permitted_by_uid_gid(userIDListRaw, groupID);
                    break;
                case "group_request_active":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Active Group Requests to Users", 400)};
                    
                    userIDs = await GroupRepo.fetch_active_member_requests_by_uid_gid(userIDListRaw, groupID, false, true);
                    break;
                case "group_request_permitted":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Permitted Group Invite Requests", 400)};
                    
                    userIDs = await GroupRepo.fetch_request_permitted_by_uid_gid(userIDListRaw, groupID);
                    break;
                case "are_group_members":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve IDs for Users in Group", 400)};
                    
                    userIDs = await GroupRepo.fetch_group_members_of_group_by_uid_gid(userIDListRaw, groupID);
                    break;
                default:
                    userIDs = userIDListRaw;
            };

            return userIDs;
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        }
    };

    static async retrieve_filtered_user_ids(userIDs: Array<string>, groupID: string, context?: string) {
        try {
            let filteredUIDs;

            switch (context) {
                case "user_request_active":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Active User Requests to Groups", 400)};

                    filteredUIDs = await GroupRepo.fetch_active_member_requests_by_uid_gid(userIDs, groupID, true, false);
                    break;
                case "user_request_permitted":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Permitted User to Group Requests", 400)};
                    
                    filteredUIDs = await GroupRepo.fetch_request_permitted_by_uid_gid(userIDs, groupID);
                    break;
                case "group_request_active":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Active Group Requests to Users", 400)};
                    
                    filteredUIDs = await GroupRepo.fetch_active_member_requests_by_uid_gid(userIDs, groupID, false, true);
                    break;
                case "group_request_permitted":
                    if (!groupID) {throw new ExpressError("Invalid Call - Retrieve Permitted Group Invite Requests", 400)};
                    
                    filteredUIDs = await GroupRepo.fetch_request_permitted_by_uid_gid(userIDs, groupID);
                    break;
                default:
                    filteredUIDs = userIDs;
            };

            return filteredUIDs;
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        }
    };

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

    static async delete_role(groupID: string, rolename: string) {
        try {
            await TransactionRepo.begin_transaction();

            const roleIDs = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, [rolename])
            if (!roleIDs || !roleIDs[0].id) {
                throw new ExpressError("Error while fetching role ids", 500);
            };  

            await GroupPermissionsRepo.delete_role_permissions_by_role_id(roleIDs[0].id);

            await GroupPermissionsRepo.delete_user_group_roles_by_role_id(roleIDs[0].id);

            const role = await GroupPermissionsRepo.delete_role_by_role_id(roleIDs[0].id);
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

    static async delete_role_permissions(groupID: string, roleName: string, permNames: Array<string>) {
        try {
            await TransactionRepo.begin_transaction();
            
            const roleID = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, [roleName]);
            if (!roleID || !roleID[0].id) {throw new ExpressError("Deleting Role Permissions Failed - Role Not Found", 400);};

            const permissionIDs = await GroupPermissionsRepo.fetch_perm_id_by_perm_name_role_id(roleID[0].id, permNames);
            if (!permissionIDs) {throw new ExpressError("Deleting Role Permissions Failed - Permissions Not Found", 400);};
            
            const rolePermissions = await GroupPermissionsRepo.delete_role_permission_by_role_permission_id(roleID[0].id, permissionIDs);
        
            await TransactionRepo.commit_transaction();    
            return rolePermissions;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
            throw new ExpressError(error.message, error.status);
        }
    };

    static async delete_group_user(groupID: string, userIDs: Array<string>) {
        try {
            await TransactionRepo.begin_transaction();

            const roles = await GroupPermissionsRepo.delete_user_group_roles_by_user_id(userIDs);
            if (!roles) {
                throw new ExpressError("Failed to Delete Roles Associated with Target User", 500);
            };
            
            const groupUser = await GroupRepo.disassociate_user_from_group(userIDs, groupID);
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

    static async delete_group_user_role(groupID: string, rolenames: Array<string>, userIDs: Array<string>) {
        const roleIDs = await GroupPermissionsRepo.fetch_roles_by_gid_role_name(groupID, rolenames)
        if (!roleIDs) {
            throw new ExpressError("Error while fetching role ids", 500);
        };  

        const roles = await GroupPermissionsRepo.delete_user_group_role_by_uid_role_id(userIDs, roleIDs);
        if (!roles) {
            throw new ExpressError("Failed to Delete User Role Associated with Target User", 500);
        };

        return roles;
    };

    static async delete_request_user_group(userIDs: Array<string>, groupID: string) {
        try {
            const userInvite = await GroupRepo.delete_request_user_group(userIDs, groupID);
            if (!userInvite) {
                throw new ExpressError("Error while deleteing group membership requests", 500);
            };

            return userInvite;
        } catch (error) {
            throw new ExpressError(error.message, error.status);
        };
    };

}

export default GroupModel;