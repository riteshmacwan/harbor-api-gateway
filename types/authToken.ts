import { Types } from "mongoose";

/**
 * Represents the body of a user token, containing user authentication information.
 * @interface
 */
export interface AuthTokenBody {
  id: Types.ObjectId;
  tokenId: Types.ObjectId;
  platform: "app" | "web";
}
