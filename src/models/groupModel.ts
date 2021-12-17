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

    static async create_role(group_id: string, name: string) {
        if (!group_id || !name) {
            throw new ExpressError("Invalid Create Group Role Call", 400);
        };

        const roleData: GroupRoleProps = {
            group_id: group_id,
            name: name
        };

        const role = GroupRoleRepo.create_new_group_role(roleData);
        return role;
    };

    static async create_role_permissions(role_id: string, name: string) {
        if (!role_id || !name) {
            throw new ExpressError("Invalid Create Group Role Permissions Call", 400);
        };

        const permData: GroupPermProps = {
            name: name
        }

        try {
            await TransactionRepo.begin_transaction();

            const permission = await GroupPermRepo.create_new_group_perm(permData);
            if (permission) {
                const rolePermData: GroupRolePermsProps = {
                    role_id: role_id,
                    permission_id: permission.id
                }

                // GroupRolePermsRepo.create_new_group_role_perm(role_id, )

            } else {
                throw new ExpressError("Error encountered when creating new permission", 400);
            }

            
        } catch (error) {
            await TransactionRepo.rollback_transaction();
        }
        


    };

    
    static async retrieve_group_by_group_id(groupID: string) {
        const group = GroupRepo.fetch_group_by_group_id(groupID);
        return group;
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
}

export default GroupModel;