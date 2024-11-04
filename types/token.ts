import { Types } from "mongoose";

/**
 * Represents the body of a user token, containing user authentication information.
 * @interface
 */
export interface TokenBody {
  user_id: Types.ObjectId;
  platform: "app" | "web";
}

export interface TokenResponse extends TokenBody {
  _id: Types.ObjectId;
}
