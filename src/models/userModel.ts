// Library Imports
import * as bcrypt from "bcrypt";
import { bcrypt_work_factor } from "../config/config";

// Helper Function Imports
import ExpressError from "../utils/expresError";

// SQL Repository Imports
import UserRepo from "../repositories/user.repository";
import TransactionRepo from "../repositories/transactionRepository";
import GroupRepo from "../repositories/group.repository";
import EquipmentRepo from "../repositories/equipment.repository";
import RoomRepo from "../repositories/room.repository";
import GroupPermissionsRepo from "../repositories/groupPermissions.repository";

// Schema Imports
import { UserAuthProps } from "../schemas/user/userAuthSchema";
import { UserRegisterProps } from "../schemas/user/userRegisterSchema";
import { UserUpdateProps } from "../schemas/user/userUpdateSchema";

/** Standard User Creation & Authentication */
class UserModel {
  /** Authenticate user with email & password. Returns user or throws error. */
  // Manual Test Success 2022/03/13
  static async authenticate(data: UserAuthProps) {
    if (!data.username){
      throw new ExpressError("Invalid Authentication Call", 400)
    };

    const user = await UserRepo.fetch_user_by_username(data.username, 'auth');

    if (user && user.password && data.password) {
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    };

    throw new ExpressError("Invalid Credentials", 401);
  }

  /** Register user with data. Returns new user data. */
  // Manual Test Success 2022/03/13
  static async register(data: UserRegisterProps) {
    if (!data.username || !data.email || !data.password){
      throw new ExpressError("Invalid Register Call", 400)
    }

    const emailCheck = await UserRepo.fetch_user_by_user_email(data.email, 'unique');
    if (emailCheck) {
      throw new ExpressError("An account is already registered with that email", 400);
    };

    const usernameCheck = await UserRepo.fetch_user_by_username(data.username, 'unique');
    if (usernameCheck) {
      throw new ExpressError("That username has already been taken", 400);
    }

    try {
      const hashedPassword = await bcrypt.hash(data.password, bcrypt_work_factor);
      data.password = hashedPassword;
      const user = await UserRepo.create_new_user(data);
  
      return user;  
    } catch (error) {
      throw new ExpressError(error.message , 400);
    }
  }
  
  /** Get user list */
  // Manual Test Success 2022/03/13
  static async retrieve_user_list_paginated(limit: number, offset: number) {
    const users = await UserRepo.fetch_user_list_paginated(limit, offset);
    return users;
  };

  /** Get user data by id */
  // Manual Test Success 2022/03/13
  static async retrieve_user_by_user_id(id: string | undefined) {
    if (!id) {
      throw new ExpressError("Error: User ID not provided", 400);
    }
    const user = await UserRepo.fetch_user_by_user_id(id, 'account');

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }
    return user;
  };

  /** Get user data by username */
  // Manual Test Success 2022/03/13
  static async retrieve_user_by_username(username: string | undefined) {
    if (!username) {
      throw new ExpressError("Error: Username not provided", 400);
    }

    const user = await UserRepo.fetch_user_by_username(username, 'profile');

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }

    // Not a great way to handle this, need to think of a better way.
    delete user.password;
    delete user.email;
    return user;
  };

  /** Update user data with `data` */
  // Manual Test Success 2022/03/13
  static async modify_user(id: string | undefined, data: UserUpdateProps) {
    if (!id) {
      throw new ExpressError("Error: User ID not provided", 400);
    }
    
    // Handle Password Change
    if (data.user_account?.password) {
      data.user_account.password = await bcrypt.hash(data.user_account.password, bcrypt_work_factor);
    }

    // Handle Email Change
    if (data.user_data?.email) {
      const duplicateCheck = await UserRepo.fetch_user_by_user_email(data.user_data?.email);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that email", 400);
      };
    }

    // Handle Username Change
    if (data.user_profile?.username) {
      const duplicateCheck = await UserRepo.fetch_user_by_username(data.user_profile?.username);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that username", 400);
      };
    }

    // Perform User Update
    const updateSuccess = await UserRepo.update_user_by_user_id(id, data);
    if (!updateSuccess) {
      throw new ExpressError("Unable to update target user", 400);
    };

    const user = await UserRepo.fetch_user_by_user_id(id, 'account');
    return user;
  };

  /** Delete target user from database; returns undefined. */
  // Manual Test - 2022/03/13 (Only delete_user_by_user_id() verified to work)
  static async delete_user(id: string) {
    try {
      const userList = [{id}]

      await TransactionRepo.begin_transaction();

      // Check for owned Groups
      const ownedGroups = await GroupRepo.fetch_group_ids_by_user_id(id, 'owner');

      // If Groups Found Delete Groups & Cleanup
      if (ownedGroups.length > 0)  {
        console.log("User owns groups");

        await EquipmentRepo.delete_equip_by_group_id(ownedGroups);
        await EquipmentRepo.delete_group_equip_by_group_id(ownedGroups);

        await RoomRepo.delete_room_by_group_id(ownedGroups);
        await RoomRepo.delete_group_room_by_group_id(ownedGroups);

        await GroupRepo.delete_group_user_roles_by_group_id(ownedGroups);
        await GroupRepo.delete_group_users_by_group_id(ownedGroups);

        await GroupPermissionsRepo.delete_role_permissions_by_group_id(ownedGroups);
        await GroupPermissionsRepo.delete_roles_by_group_id(ownedGroups);

        await GroupRepo.delete_groups_by_group_id(ownedGroups);
      };

      // Cleanup User Group & GroupRoles
      await GroupRepo.delete_user_grouproles_by_user_id(userList);
      await GroupRepo.delete_user_groups_by_user_id(userList);

      // Cleanup User Equipment
      await EquipmentRepo.delete_equip_by_user_id(userList);
      await EquipmentRepo.delete_user_equip_by_user_id(userList);

      // Cleanup User Rooms
      await RoomRepo.delete_room_by_user_id(userList);
      await RoomRepo.delete_user_room_by_user_id(userList);

      // Clean Up User Tables & Site Roles:
      await UserRepo.delete_user_by_user_id(id);

      await TransactionRepo.commit_transaction()

      return true;
    } catch (error) {
      await TransactionRepo.rollback_transaction(); 
      throw new ExpressError("Delete Failed", 500);
    }    
  };
}
  
  
export default UserModel;