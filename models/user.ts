import { Schema, Document, Model, model, Types } from "mongoose";
import { UserBody } from "../types/user";

/**
 * Interface representing a script category document.
 */
type IUser = UserBody & Document;

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    country_code: { required: false, type: String },
    phone_number: {
      required: false,
      type: String,
    },
    apple_id: {
      required: false,
      type: String,
    },
    google_id: {
      required: false,
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Create a compound index for country_code and phone_number
UserSchema.index(
  { country_code: 1, phone_number: 1 },
  {
    unique: true,
    partialFilterExpression: { phone_number: { $exists: true, $ne: null } },
  }
);

export const User: Model<IUser> = model<IUser>("User", UserSchema);
