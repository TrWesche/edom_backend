import * as bcrypt from "bcrypt";
import { bcrypt_work_factor } from "../config/config";
import ExpressError from "../utils/expresError";

import UserRepo, { UserObjectProps } from "../repositories/user.repository";
import TransactionRepo from "../repositories/transactionRepository";
import SitePermissionsRepo from "../repositories/sitePermissions.repository";
import { UserAuthProps } from "../schemas/user/userAuthSchema";
import { UserRegisterProps } from "../schemas/user/userRegisterSchema";
import { UserUpdateProps } from "../schemas/user/userUpdateSchema";

/** Standard User Creation & Authentication */
class UserModel {
  /** Authenticate user with email & password. Returns user or throws error. */
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
  
  /** Get user data by id */
  static async retrieve_user_by_user_id(id: string | undefined) {
    if (!id) {
      throw new ExpressError("Error: User ID not provided", 400);
    }
    const user = await UserRepo.fetch_user_by_user_id(id, 'profile');

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }
    return user;
  }

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
  }

  /** Update user data with `data` */
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
  }

  /** Delete target user from database; returns undefined. */
  static async delete_user(id: string) {
    try {
      await TransactionRepo.begin_transaction();
      // Clean Up User Site Roles:
      const siteRoleCleanupSuccess = await SitePermissionsRepo.delete_user_site_roles_all(id);
      if (!siteRoleCleanupSuccess) {
        throw new ExpressError(`Site Role Cleanup Failed`, 500);
      }

      // Clean Up User Table:
      const result = await UserRepo.delete_user_by_user_id(id);

      if (!result) {
        throw new ExpressError("Delete failed, unable to locate target user", 400);
      }

      await TransactionRepo.commit_transaction()

      return result;
    } catch (error) {
      await TransactionRepo.rollback_transaction(); 
    }    
  }
}
  
  
export default UserModel;