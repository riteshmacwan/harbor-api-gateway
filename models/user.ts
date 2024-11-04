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
      unique: true,
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
    first_name: {
      required: true,
      type: String,
    },
    last_name: {
      required: true,
      type: String,
    },
    is_profile_set: {
      type: Boolean,
      default: false,
    },
    cv: {
      required: false,
      type: String,
    },
    licenses: {
      required: false,
      type: [String],
    },
    company: {
      required: false,
      type: String,
    },
    birth_date: {
      required: false,
      type: Date,
    },
    gender: {
      required: true,
      type: String,
      enum: ["male", "female", "other"],
    },
    //   requires update in the future
    location: {
      type: String,
      required: true,
    },
    skill_ids: {
      type: [Schema.Types.ObjectId],
      ref: "skills", // Referencing the 'skills' collection
      required: false,
    },
    about: {
      required: false,
      type: String,
    },
    plan_id: {
      type: Schema.Types.ObjectId,
      ref: "plans", // Referencing the 'skills' collection
      required: false,
    },
    level: {
      required: false,
      type: Number,
      default: 1,
    },
    language: {
      required: false,
      type: String,
      enum: ["English", "Spanish"],
    },
    email: {
      required: true,
      type: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const User: Model<IUser> = model<IUser>("User", UserSchema);
