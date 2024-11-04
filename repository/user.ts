import { ObjectId } from "mongoose";
import { User } from "../models/user";
import { UserBody, UserResponse } from "../types/user";
import { AuthBody } from "../types/auth";

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
  async createUser(data: AuthBody): Promise<UserResponse | null> {
    try {
      const res: UserResponse | null = await User.create(data);
      return res;
    } catch (error: any) {
      console.log("UserRepository/createUser error -->", error);
      return null;
    }
  }

  /**
   * Find a user
   * @param {AuthBody} data - auth data for user.
   * @returns {Promise<UserResponse | null>} A Promise that resolves with the found auth body response or null if not found.
   */
  async findUser(data: AuthBody): Promise<UserResponse | null> {
    try {
      let findUserBy: any = { $or: [] };
      if (data.country_code && data.phone_number) {
        findUserBy.$or.push({
          $and: [
            { country_code: data.country_code },
            { phone_number: data.phone_number },
          ],
        });
      }

      if (data.google_id) {
        findUserBy.$or.push({ google_id: data.google_id });
      }
      if (data.apple_id) {
        findUserBy.$or.push({ apple_id: data.apple_id });
      }
      const res: UserResponse | null = await User.findOne(findUserBy);
      return res;
    } catch (error: any) {
      console.log("UserRepository/findUser error -->", error);
      return null;
    }
  }
}
