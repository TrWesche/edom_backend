// Repositories
import GroupRepo, { GroupObjectProps } from "../repositories/group.repository";
import GroupRoleRepo, { GroupRoleProps } from "../repositories/groupRole.repository";
import GroupPermRepo, { GroupPermProps } from "../repositories/groupPerm.repository";
import GroupRolePermsRepo, { GroupRolePermsProps } from "../repositories/groupRolePerms.repository";

// Schemas
import { GroupCreateProps } from "../schemas/group/groupCreateSchema";

// Utils
import ExpressError from "../utils/expresError";
import TransactionRepo from "../repositories/transactionRepository";


class GroupModel {
    static async create(data: GroupCreateProps) {
        if (!data.name) {
            throw new ExpressError("Invalid Create Group Call", 400);
        };

        const group = GroupRepo.create_new_group(data);
        return group;
    };

    static async create_role(groupID: string, name: string) {
        if (!groupID || !name) {
            throw new ExpressError("Invalid Create Group Role Call", 400);
        };

        const roleData: GroupRoleProps = {
            group_id: groupID,
            name: name
        };

        const role = GroupRoleRepo.create_new_group_role(roleData);
        return role;
    };

    static async create_role_permissions(roleID: string, name: string) {
        if (!roleID || !name) {
            throw new ExpressError("Invalid Create Group Role Permissions Call", 400);
        };

        const permData: GroupPermProps = {
            name: name
        }

        try {
            await TransactionRepo.begin_transaction();

            let permission = await GroupPermRepo.create_new_group_perm(permData);
            let rolePermission: Array<GroupRolePermsProps>;

            if (permission && permission.id) {
                rolePermission = await GroupRolePermsRepo.create_new_group_role_perm(roleID, [permission.id]);
            } else {
                throw new ExpressError("Error encountered when creating new permission", 400);
            }

            if (rolePermission.length > 0 && rolePermission[0].permission_id) {
                await TransactionRepo.commit_transaction();
            }
    
            return permission;
        } catch (error) {
            await TransactionRepo.rollback_transaction();
        }
    };

    
    static async retrieve_group_by_group_id(groupID: string) {
        const group = GroupRepo.fetch_group_by_group_id(groupID);
        return group;
    };

    static async retrieve_group_roles_by_group_id(groupID: string) {
        const roles = GroupRoleRepo.fetch_group_roles_by_group_id(groupID);
        return roles;
    };
    
    static async retrieve_group_role_permissions_by_role_id(roleID: string) {
        const permissions = GroupRolePermsRepo.fetch_group_role_perms_by_group_role_id(roleID);
        return permissions;
    };


    static async modify_group(groupID: string, data: GroupCreateProps) {
        if (!groupID) {
            throw new ExpressError("Error: Group ID not provided", 400);
        };

        // Perform Group Update
        const group = await GroupRepo.update_group_by_group_id(groupID, data);
        if (!group) {
            throw new ExpressError("Unable to update target group", 400);
        };

        return group;
    };


    static async delete_group(groupID: string) {
        if (!groupID) {
            throw new ExpressError("Error: Group ID not provided", 400);
        };

        const group = await GroupRepo.delete_group_by_group_id(groupID);
        if (!group) {
            throw new ExpressError("Unable to delete target group", 400);
        };

        return group;
    };

    static async delete_role(roleID: string) {
        if (!roleID) {
            throw new ExpressError("Error: Role ID not provided", 400);
        };

        const role = await GroupRoleRepo.delete_group_role_by_group_role_id(roleID);
        if (!role) {
            throw new ExpressError("Unable to delete target role", 400);
        };

        return role;
    };

    static async delete_role_permission(permID: string) {
        if (!permID) {
            throw new ExpressError("Error: Permission ID not provided", 400);
        };

        const permission = await GroupPermRepo.delete_group_perm_by_group_perm_id(permID);
        if (!permission) {
            throw new ExpressError("Unable to delete target permission", 400);
        };

        return permission;
    };
}

export default GroupModel;