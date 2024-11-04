import { UserRepository } from "../repository/user";
import { Authentication, TokenRepository } from "../repository";
import { ObjectId } from "mongoose";
import { AuthBody, AuthBodyResponse } from "@types/auth";

export class AuthService {
  private userRepository: UserRepository;
  private tokenRepository: TokenRepository;

  // initializing the repositories
  constructor() {
    this.userRepository = new UserRepository();
    this.tokenRepository = new TokenRepository();
  }

  // Function to get user details by user id
  async getUserDetails(userId: ObjectId) {
    return await this.userRepository.findOneByUserId(userId);
  }

  // Function to get token details
  async getUserTokenDetails(
    tokenId: ObjectId,
    userId: ObjectId,
    platform: string
  ) {
    return await this.tokenRepository.findTokenData(tokenId, userId, platform);
  }

  /**
   * Creates a new user.
   * @async
   * @param {AuthBody} data - The data of the user to be created.
   * @returns {Promise<AuthBodyResponse>} A Promise that resolves when the department is created.
   */
  async signUp(data: AuthBody) {
    // return await this.userRepository.(data);
  }
}
