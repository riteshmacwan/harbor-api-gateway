import { TokenRepository } from "../repository/token";
import { UserTokenRepository } from "../repository";
import { ObjectId } from "mongoose";

/**
 * Service class for managing user tokens.
 * This class provides methods to interact with user tokens stored in a repository.
 */
export class UserTokenService {
  private tokenRepository: TokenRepository;

  /**
   * Creates an instance of TokenService.
   * Initializes the user token repository.
   * @constructor
   */
  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  /**
   * Finds a user token by email.
   * Retrieves the user token associated with the given email address.
   * @param {string} email - The email address of the user.
   * @returns {Promise<UserTokenBody | null>} A promise that resolves with the user token object if found, otherwise undefined.
   */
  async findOneByUserId(userId: ObjectId) {
    return await this.tokenRepository.findOneByUserId(userId);
  }
}
