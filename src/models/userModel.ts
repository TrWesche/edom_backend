import bcrypt from "bcrypt";
import { bcrypt_work_factor } from "../config/config";
import ExpressError from "../utils/expresError";

const {
  create_new_user,
  fetch_user_by_user_email,
  fetch_user_by_user_id,
  update_user_by_user_id,
  delete_user_by_user_id
} = require("../repositories/user.repository");

/** Standard User Creation & Authentication */
class UserModel {
  /** Authenticate user with email & password. Returns user or throws error. */
  static async authenticate(data) {
    const user = await fetch_user_by_user_email(data.email);

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        delete user.password;
        delete user.email;
        user.type = "user";
        return user;
      }
    }

    throw new ExpressError("Invalid Credentials", 401);
  }

  /** Register user with data. Returns new user data. */
  static async register(data) {
    const duplicateCheck = await fetch_user_by_user_email(data.email);

    if (duplicateCheck) {
      throw new ExpressError("A user already exists with that email", 400);
    };

    const hashedPassword = await bcrypt.hash(data.password, bcrypt_work_factor);
    const user = await create_new_user(data, hashedPassword);
    user.type = "user";

    return user;
  }
  
  /** Get user data by id */
  static async retrieve_user_by_user_id(id) {
    const user = await fetch_user_by_user_id(id);

    if (!user) {
      throw new ExpressError("Unable to locate target user", 404);
    }
    return user;
  }

  /** Update user data with `data` */
  static async modify_user(id, data) {
    // Handle Password Change
    if (data.password) {
      data.password = await bcrypt.hash(data.password, bcrypt_work_factor);
    }

    // Handle Email Change
    if (data.email) {
      const duplicateCheck = await fetch_user_by_user_email(data.email);
      if (duplicateCheck && duplicateCheck.id !== id) {
        throw new ExpressError("A user already exists with that email", 400);
      };
    }

    // Perform User Update
    const user = await update_user_by_user_id(id, data);
    if (!user) {
      throw new ExpressError("Unable to update target user", 400);
    }

    // Cleanse Return Data
    delete user.password;
    delete user.id;
    return user;
  }

  /** Delete target user from database; returns undefined. */
  static async delete_user(id) {
    const result = await delete_user_by_user_id(id);

    if (!result) {
      throw new ExpressError("Delete failed, unable to locate target user", 400);
    }
    return result;
  }
}
  
  
export default UserModel;