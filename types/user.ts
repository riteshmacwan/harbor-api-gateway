import { Date, Types } from "mongoose";

export interface UserBody {
  _id: string;
  country_code: string;
  phone_number: string;
  apple_id: string;
  google_id: string;
  first_name: string;
  last_name: string;
  is_profile_set: boolean;
  cv: string;
  licenses: [string];
  company: string;
  birth_date: Date;
  gender: "male" | "female" | "other";
  location: string;
  skill_ids?: [Types.ObjectId];
  about: string;
  plan_id?: Types.ObjectId;
  level: number;
  language: string;
  email: string;
}

export interface UserResponse extends UserBody {
  _id: string;
}
