import { ObjectId } from "mongoose";
import { Token } from "../models/token";
import { TokenBody, TokenResponse } from "../types/token";

/**
 * Repository class for managing user tokens.
 */
export class TokenRepository {
  /**
   * Finds a user token by email.
   * @param {string} email - The email of the user.
   * @returns {Promise<TokenBody | null>} A Promise that resolves with the found user token or null if not found.
   */
  async findTokenData(
    tokenId: ObjectId,
    userId: ObjectId,
    platform: string
  ): Promise<TokenResponse | null> {
    try {
      const data: TokenResponse | null = await Token.findOne({
        _id: tokenId,
        user_id: userId,
        platform: platform,
      });
      return data;
    } catch (error: any) {
      console.log(
        "TokenRepository/findOneByTokenIdAndPlatform error -->",
        error
      );
      return null;
    }
  }
}
