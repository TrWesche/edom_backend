import * as bcrypt from "bcrypt";
import { bcrypt_work_factor } from "../config/config";
import ExpressError from "../utils/expresError";

import UserRepo, { UserObjectProps } from "../repositories/user.repository";
import TransactionRepo from "../repositories/transactionRepository";
import SitePermissionsRepo from "../repositories/sitePermissions.repository";

/** Standard User Creation & Authentication */
class UserModel {
  /** Authenticate user with email & password. Returns user or throws error. */
  static async authenticate(data: UserObjectProps) {
    if (!data.username){
      throw new ExpressError("Invalid Authentication Call", 400)
    }

    const user = await UserRepo.fetch_user_by_username(data.username);

    if (user && user.password && data.password) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        delete user.password;
        delete user.email;

        const siteRole = await SitePermissionsRepo.fetch_role_by_role_name('user');
        if (siteRole?.id && user.id) {
          const permissionAssignment = await SitePermissionsRepo.create_user_site_role(user.id, siteRole.id);

          if (permissionAssignment.length > 0) {
            await TransactionRepo.commit_transaction();
            if (user.roles) {
              user.roles.push({name: siteRole.name});
            } else {
              user.roles = [{name: siteRole.name}]
            };
          } else {
            throw new ExpressError("Error encountered while assigning user role", 400);
          }

        } else {
          throw new ExpressError("Error encountered while retrieving role information", 400);
        }

        return user;
      }
    }

    throw new ExpressError("Invalid Credentials", 401);
  }

  /** Register user with data. Returns new user data. */
  static async register(data: UserObjectProps) {
    if (!data.username || !data.email || !data.password){
      throw new ExpressError("Invalid Register Call", 400)
    }

    const emailCheck = await UserRepo.fetch_user_by_user_email(data.email);
    if (emailCheck) {
      throw new ExpressError("An account is already registered with that email", 400);
    };

    const usernameCheck = await UserRepo.fetch_user_by_username(data.username);
    if (usernameCheck) {
      throw new ExpressError("That username has already been taken", 400);
    }

    try {
      await TransactionRepo.begin_transaction()

      const hashedPassword = await bcrypt.hash(data.password, bcrypt_work_factor);
      data.password = hashedPassword;
      const user = await UserRepo.create_new_user(data, hashedPassword);

      if (user) {
        const siteRole = await SitePermissionsRepo.fetch_role_by_role_name('user');
        if (siteRole?.id && user.id) {
          const permissionAssignment = await SitePermissionsRepo.create_user_site_role(user.id, siteRole.id);

          if (permissionAssignment.length > 0) {
            await TransactionRepo.commit_transaction();
            if (user.roles) {
              user.roles.push({name: siteRole.name});
            } else {
              user.roles = [{name: siteRole.name}]
            };
          } else {
            throw new ExpressError("Error encountered while assigning user role", 400);
          }

        } else {
          throw new ExpressError("Error encountered while retrieving role information", 400);
        }
      }
  
      return user;  
    } catch (error) {
      await TransactionRepo.rollback_transaction();
      throw new ExpressError(error.message , 400);
    }
  }
  
  /** Get user data by id */
  static async retrieve_user_by_user_id(id: string | undefined) {
    if (!id) {
      throw new ExpressError("Error: User ID not provided", 400);
    }
    const user = await UserRepo.fetch_user_by_user_id(id);

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }
    return user;
  }

  static async retrieve_user_by_username(username: string | undefined) {
    if (!username) {
      throw new ExpressError("Error: Username not provided", 400);
    }

    const user = await UserRepo.fetch_user_by_username(username);

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }

    // Not a great way to handle this, need to think of a better way.
    delete user.password;
    delete user.email;
    return user;
  }

  /** Update user data with `data` */
  static async modify_user(id: string | undefined, data: UserObjectProps) {
    if (!id) {
      throw new ExpressError("Error: User ID not provided", 400);
    }
    
    // Handle Password Change
    if (data.password) {
      console.log("Changing Password");
      data.password = await bcrypt.hash(data.password, bcrypt_work_factor);
    }

    // Handle Email Change
    if (data.email) {
      const duplicateCheck = await UserRepo.fetch_user_by_user_email(data.email);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that email", 400);
      };
    }

    // Handle Username Change
    if (data.username) {
      const duplicateCheck = await UserRepo.fetch_user_by_username(data.username);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that username", 400);
      };
    }

    // Perform User Update
    const user = await UserRepo.update_user_by_user_id(id, data);
    if (!user) {
      throw new ExpressError("Unable to update target user", 400);
    }

    // Cleanse Return Data
    delete user.password;
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