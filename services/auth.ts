import { UserRepository } from "../repository/user";
import { TokenRepository } from "../repository";
import { ObjectId } from "mongoose";
import { AuthBody } from "../types/auth";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { CommonUtils } from "../utils";
import { AuthTokenBody } from "../types/authToken";
const commonUtils = CommonUtils.getInstance();

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
   * Login users to platform.
   * @async
   * @body {AuthBody} data - The data of the user to be created.
   * @returns {Promise<AuthBodyResponse>}
   */
  async login(data: AuthBody, res: Response) {
    // Check if user is already exists or not
    let user = await this.userRepository.findUser(data);

    // Send error response if user is not exists
    if (!user) {
      return res.status(401).json({
        status: false,
        data: null,
        message: "User does not exists with provided data.",
      });
    }

    // Add get token data
    let tokenData = await this.tokenRepository.findTokenByUserId(user._id);

    if (tokenData && tokenData.platform == data.platform) {
      // delete the existing token and create new token
      await this.tokenRepository.deleteTokenById(tokenData._id);
    }

    tokenData = await this.tokenRepository.createToken(user._id, data.platform);

    if (!tokenData) {
      return res.status(401).json({
        status: false,
        data: null,
        message: "Could not generate token.",
      });
    }

    // Sign jwt with new token and user id
    let loginCacheData = {
      id: user._id,
      tokenId: tokenData._id,
      platform: data.platform,
    };

    const token = jwt.sign(
      loginCacheData,
      process.env.NODE_ENV != "local"
        ? await commonUtils.getSecret(`${process.env.NODE_ENV}-JWT-SECRET`)
        : process.env.JWT_SECRET
    );

    await commonUtils.setCache(token, JSON.stringify(loginCacheData));

    return res.status(200).json({
      status: true,
      data: token,
    });
  }

  /**
   * Registers a new user to platform.
   * @async
   * @body {AuthBody} data - The data of the user to be created.
   * @returns {Promise<AuthBodyResponse>}
   */
  async signUp(data: AuthBody, res: Response) {
    // Check if user is already exists or not
    let user = await this.userRepository.findUser(data);

    // Send error response if user is already exists
    if (user) {
      return res.status(401).json({
        status: false,
        data: null,
        message: "User is already exists with provided data.",
      });
    }

    // Create new user
    user = await this.userRepository.createUser(data);
    if (!user) {
      return res.status(401).json({
        status: false,
        data: null,
        message: "User not created.",
      });
    }

    // Add new entry in token
    const tokenData = await this.tokenRepository.createToken(
      user._id,
      data.platform
    );

    // Send error response if there is something wrong creating new record in token
    if (!tokenData) {
      return res.status(500).json({
        status: false,
        data: null,
        message: "Token is not created.",
      });
    }

    // Sign jwt with new token and user id
    let loginCacheData = {
      id: user._id,
      tokenId: tokenData._id,
      platform: data.platform,
    };

    const token = jwt.sign(
      loginCacheData,
      process.env.NODE_ENV != "local"
        ? await commonUtils.getSecret(`${process.env.NODE_ENV}-JWT-SECRET`)
        : process.env.JWT_SECRET
    );

    await commonUtils.setCache(token, JSON.stringify(loginCacheData));

    return res.status(200).json({
      status: true,
      data: token,
    });
  }

  /**
   * Logout a user from platform.
   * @async
   * @body {AuthTokenBody} data - The data of the user to be logged out.
   * @returns {Promise<Boolean>}
   */
  async logout(authTokenData: AuthTokenBody, res: Response) {
    // delete the token from the table
    const tokenData = await this.tokenRepository.deleteTokenById(
      authTokenData.tokenId.toString()
    );

    // Send error response if there is something wrong creating new record in token
    if (!tokenData) {
      return res.status(500).json({
        status: false,
        data: null,
        message: "Token is not deleted.",
      });
    }

    return res.status(200).json({
      status: true,
      data: null,
      message: "Logged out.",
    });
  }
}
