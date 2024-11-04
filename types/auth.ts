/**
 * Represents the body of a login credentials, typically used to perform login by credentials.
 * @interface
 */
export interface AuthBody {
  country_code?: string;
  phone_number?: string;
  google_id?: string;
  apple_id?: string;
}

export interface AuthBodyResponse extends AuthBody {
  _id: string;
}

export interface LoginBodyResponse extends AuthBody {
  token: string;
}
