/**
 * Represents the body of a login credentials, typically used to perform login by credentials.
 * @interface
 */

export interface UserInfoBody {
  country_code?: string;
  phone_number?: string;
  google_id?: string;
  apple_id?: string;
}
export interface AuthBody extends UserInfoBody {
  platform: "app" | "web";
}

export interface LoginBodyResponse extends AuthBody {
  token: string;
}
