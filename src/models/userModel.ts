import * as bcrypt from "bcrypt";
import { bcrypt_work_factor } from "../config/config";
import ExpressError from "../utils/expresError";

import UserRepository, { UserObjectProps } from "../repositories/userRepository";

/** Standard User Creation & Authentication */
class UserModel {
  /** Authenticate user with email & password. Returns user or throws error. */
  static async authenticate(data: UserObjectProps) {
    if (!data.username){
      throw new ExpressError("Invalid Authentication Call", 400)
    }

    const user = await UserRepository.fetch_user_by_username(data.username);

    if (user && user.password && data.password) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        delete user.password;
        delete user.email;
        // TODO: User Roles & Permissions Will Need to be added
        user.permissions = {
          role: "user"
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

    const emailCheck = await UserRepository.fetch_user_by_user_email(data.email);
    if (emailCheck) {
      throw new ExpressError("An account is already registered with that email", 400);
    };

    const usernameCheck = await UserRepository.fetch_user_by_username(data.username);
    if (usernameCheck) {
      throw new ExpressError("That username has already been taken", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, bcrypt_work_factor);
    const user = await UserRepository.create_new_user(data, hashedPassword);
    // TODO: User Roles & Permissions Will Need to be added
    if (user) {
      user.permissions = {
        role: "user"
      }
    }

    return user;
  }
  
  /** Get user data by id */
  static async retrieve_user_by_user_id(id: string | undefined) {
    if (!id) {
      throw new ExpressError("Error: User ID not provided", 400);
    }
    const user = await UserRepository.fetch_user_by_user_id(id);

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }
    return user;
  }

  static async retrieve_user_by_username(username: string | undefined) {
    if (!username) {
      throw new ExpressError("Error: Username not provided", 400);
    }

    const user = await UserRepository.fetch_user_by_username(username);

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
      data.password = await bcrypt.hash(data.password, bcrypt_work_factor);
    }

    // Handle Email Change
    if (data.email) {
      const duplicateCheck = await UserRepository.fetch_user_by_user_email(data.email);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that email", 400);
      };
    }

    // Handle Username Change
    if (data.username) {
      const duplicateCheck = await UserRepository.fetch_user_by_username(data.username);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that username", 400);
      };
    }

    // Perform User Update
    const user = await UserRepository.update_user_by_user_id(id, data);
    if (!user) {
      throw new ExpressError("Unable to update target user", 400);
    }

    // Cleanse Return Data
    delete user.password;
    return user;
  }

  /** Delete target user from database; returns undefined. */
  static async delete_user(id: string) {
    const result = await UserRepository.delete_user_by_user_id(id);

    if (!result) {
      throw new ExpressError("Delete failed, unable to locate target user", 400);
    }
    return result;
  }
}
  
  
export default UserModel;