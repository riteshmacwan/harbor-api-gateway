import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../services";
import { CommonUtils } from "../utils/common";
const commonUtils = CommonUtils.getInstance();

/**
 * Middleware to verify the authentication token.
 * It first checks the token in the Redis cache, and if not found,
 * it validates the token with Google's authentication service.
 * If the token is validated, the user data is cached and added to the request object.
 *
 * @param {Request} req - The express request object, which should have the authorization header.
 * @param {Response} res - The express response object, used to send responses to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} - A promise that resolves when the middleware has completed processing.
 */

export class Authentication {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token is used
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const authHeader = req.headers["authorization"];

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring("Bearer ".length).trim();

        let decoded = await jwt.verify(
          token,
          await commonUtils.getSecret(`${process.env.NODE_ENV}-JWT-SECRET`)
        );

        let cacheData = await commonUtils.getCache(token);
        if (cacheData) {
          return next();
        }

        // Call the getUserTokenDetails method to get token information for particular user to manage sessions
        const userData = await this.authService.getUserTokenDetails(
          decoded.tokenId,
          decoded.sub,
          decoded.platform
        );

        if (!userData) {
          return res.status(401).json({ error: "Invalid Token Provided." });
        }

        let loginCacheData = {
          Id: userData.user_id,
          TokenId: decoded.tokenId,
          Platform: decoded.platform,
        };
        console.log("loginCacheData", loginCacheData);

        await commonUtils.setCache(token, JSON.stringify(loginCacheData));
        return next();
      }

      return res.status(401).json({ error: "Invalid Token Provided." });
    } catch (ex) {
      return res.status(401).json({ error: "Invalid Token Provided." });
    }
  };

  /**
   * This middleware is used to create the dummy token for run the test case
   * @returns Dummy Token for check the test case
   */
  login = async (req: Request, res: Response) => {
    try {
      let loginCacheData = {
        Id: "123",
        Email: "sahil.gw@dmclinical.com",
        sub: "sahil.gw@dmclinical.com",
        FirstName: "Sahil",
        LastName: "Shaikh",
        Roles: ["SuperAdmins"],
      };
      const token = jwt.sign(
        loginCacheData,
        await commonUtils.getSecret(`${process.env.NODE_ENV}-JWT-SECRET`)
      );
      await commonUtils.setCache(token, JSON.stringify(loginCacheData));
      res.status(200).json({ message: "Login successful", token });
    } catch (error: any) {
      console.log("🚀 ~ Authentication ~ login= ~ error:", error);
      return res.status(401).json({ error: "Invalid Token Provided." });
    }
  };
}
