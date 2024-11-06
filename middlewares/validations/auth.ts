import { Request, Response, NextFunction } from "express";
import {
  check,
  validationResult,
  ValidationChain,
  body,
} from "express-validator";

/**
 * Represents an item containing validation result information.
 * @interface ValidationResultItem
 * @property {string} msg - A message describing the validation result.
 */
interface ValidationResultItem {
  msg: string;
}

/**
 * Validates the body of a login credentials, typically used to perform login by credentials.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const validateAuthBody: ValidationChain[] = [
  /**
   * Validates the country_code field.
   */
  check("country_code")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Country code must not exceed 10 characters."),

  /**
   * Validates the phone_number field.
   */
  check("phone_number")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Phone number must be a valid mobile phone number."),

  /**
   * Validates the google_id field.
   */
  check("google_id")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Google ID cannot be empty if provided."),

  /**
   * Validates the apple_id field.
   */
  check("apple_id")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Apple ID cannot be empty if provided."),

  /**
   * Custom validation to ensure either google_id or apple_id is provided.
   */
  check().custom((value, { req }) => {
    if (!req.body.google_id && !req.body.apple_id) {
      if (!req.body.country_code && !req.body.phone_number) {
        throw new Error(
          "Either Phone number or Google ID or Apple ID is required."
        );
      }
    }
    return true;
  }),

  /**
   * Validates the platform field.
   */
  check("platform")
    .trim()
    .notEmpty()
    .withMessage("Platform is required.")
    .isIn(["app", "web"])
    .withMessage("Platform must be one of the following ['app', 'web']."),
];

/**
 * Validates the body of a check user api.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const validateCheckUserBody: ValidationChain[] = [
  /**
   * Validates the country_code field.
   */
  check("country_code")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Country code must not exceed 10 characters."),

  /**
   * Validates the phone_number field.
   */
  check("phone_number")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Phone number must be a valid mobile phone number."),

  /**
   * Validates the google_id field.
   */
  check("google_id")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Google ID cannot be empty if provided."),

  /**
   * Validates the apple_id field.
   */
  check("apple_id")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Apple ID cannot be empty if provided."),

  /**
   * Custom validation to ensure either google_id or apple_id is provided.
   */
  check().custom((value, { req }) => {
    if (!req.body.google_id && !req.body.apple_id) {
      if (!req.body.country_code && !req.body.phone_number) {
        throw new Error(
          "Either Phone number or Google ID or Apple ID is required."
        );
      }
    }
    return true;
  }),
];

/**
 * Validates the request parameters using express-validator and sends an error response if validation fails.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {import('express').Response | void} Returns a JSON response with error details if validation fails, otherwise passes control to the next middleware.
 */
export const validation = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  let error: string[] = [];
  const result: ValidationResultItem[] = validationResult(req).array();
  if (!result.length) return next();

  result.forEach((validationResultItem) => {
    error.push(validationResultItem.msg);
  });

  return res.json({
    status: false,
    message: error ? error[0] : "",
    data: {},
    code: 400,
  });
};
