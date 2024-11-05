import { ObjectId, Types } from "mongoose";
import { Token } from "../models/token";
import { TokenBody, TokenResponse } from "../types/token";

/**
 * Repository class for managing user tokens.
 */
export class TokenRepository {
  /**
   * Finds a user token by userId.
   * @param {string} userId - The if of the user.
   * @returns {Promise<TokenBody | null>} A Promise that resolves with the found user token or null if not found.
   */
  async findTokenByUserId(userId: string): Promise<TokenResponse | null> {
    try {
      const data: TokenResponse | null = await Token.findOne({
        user_id: new Types.ObjectId(userId),
      });
      return data;
    } catch (error: any) {
      console.log("TokenRepository/findTokenByUserId error -->", error);
      return null;
    }
  }

  /**
   * Delete a token by id
   * @param {string} id - The id of the token.
   * @returns {Boolean} A boolean if token is deleted true or false if token is not deleted.
   */
  async deleteTokenById(id: string): Promise<Boolean> {
    try {
      await Token.findByIdAndDelete(id);
      return true;
    } catch (error: any) {
      console.log("TokenRepository/deleteTokenById error -->", error);
      return false;
    }
  }

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

  /**
   * Create a new user token.
   * @param {ObjectId} userId - The Id of the user.
   * @param {"app" | "web"} platform - The platform of the user.
   * @returns {Promise<TokenResponse | null>} A Promise that resolves with the created user token or null if an error occurs.
   */
  async createToken(
    userId: string,
    platform: "app" | "web"
  ): Promise<any | null> {
    try {
      const data = await Token.create({
        user_id: new Types.ObjectId(userId),
        platform: platform,
      });
      return data;
    } catch (error: any) {
      console.log("TokenRepository/createToken error -->", error);
      return null;
    }
  }
}
