import { ObjectId } from "mongoose";
import { Token } from "../models/token";
import { TokenResponse } from "../types/token";

/**
 * Repository class for managing user tokens.
 */
export class TokenRepository {
  /**
   * Finds a user token by email.
   * @param {string} email - The email of the user.
   * @returns {Promise<UserTokenBody | null>} A Promise that resolves with the found user token or null if not found.
   */
  async findOneByUserId(userId: ObjectId): Promise<TokenResponse | null> {
    try {
      const data: TokenResponse | null = await Token.findOne({
        user_id: userId,
      });
      return data;
    } catch (error: any) {
      console.log("TokenRepository/findOneByEmail error -->", error);
      return null;
    }
  }
}
