import { ObjectId } from "mongoose";
import { User } from "../models/user";
import { UserBody, UserResponse } from "../types/user";
import { AuthBody, AuthBodyResponse } from "@types/auth";

/**
 * Repository class for managing user tokens.
 */
export class UserRepository {
  /**
   * Finds a user token by email.
   * @param {string} email - The email of the user.
   * @returns {Promise<UserBody | null>} A Promise that resolves with the found user token or null if not found.
   */
  async findOneByUserId(userId: ObjectId): Promise<UserResponse | null> {
    try {
      const data: UserResponse | null = await User.findById(userId, {
        _id: true,
      });
      return data;
    } catch (error: any) {
      console.log("UserRepository/findOneByUserId error -->", error);
      return null;
    }
  }

  /**
   * Creates a user
   * @param {AuthBody} data - auth data for user.
   * @returns {Promise<UserResponse | null>} A Promise that resolves with the found auth body response or null if not found.
   */
  async createUser(data: AuthBody): Promise<AuthBodyResponse | null> {
    try {
      const res: UserResponse | null = await User.create(data);
      return res;
    } catch (error: any) {
      console.log("UserRepository/createUser error -->", error);
      return null;
    }
  }
}
