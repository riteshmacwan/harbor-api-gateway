import { Request, Response } from "express";
import { AuthService } from "../services";
import { AuthBody } from "../types/auth";

/**
 * Controller class responsible for handling operations related to auth service.
 */
export class AuthController {
  /**
   * Service responsible for managing authentication data.
   * @private
   */
  private authService: AuthService;

  /**
   * Creates an instance of AuthController.
   * Initializes the authService for interacting with authentication data.
   * @constructor
   */
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Creates a user based on the request body.
   * @async
   * @function - create user
   * @param {Request<{}, {}, AuthBody>} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  signUp = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
  ): Promise<Response> => {
    // Create a user using the provided data
    return await this.authService.signUp(req.body, res);
  };

  /**
   * Login a user based on the request body.
   * @async
   * @function - login user
   * @param {Request<{}, {}, AuthBody>} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  login = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
  ): Promise<Response> => {
    // Login a user using the provided data
    return await this.authService.login(req.body, res);
  };

  /**
   * Logout a user.
   * @async
   * @function - logout user
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>} The response indicating success or failure.
   */
  logout = async (req: Request, res: Response): Promise<Response> => {
    // Logout a user using the provided data
    return await this.authService.logout(req["user"], res);
  };
}
