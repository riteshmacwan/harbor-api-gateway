import { Request, Response, NextFunction } from "express";
import appInsightsUtils from "./../utils/appInsightsUtils";
import logger from "../utils/logger";

/**
 * Error handling middleware to intercept and process errors thrown in the application.
 *
 * @param err - The error object passed from previous middleware or route handlers.
 * @param req - The express request object.
 * @param res - The express response object.
 * @param next - The next middleware function in the stack.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error occurred: ${err.message}`);

  // Let's log the error to AzureAppInsights
  appInsightsUtils.logException(err, {
    path: req.path,
    statusCode: err.status || 500,
    message: err.message || "An unknown error occurred",
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500);

  // Send a JSON response to the client with error information
  res.json({
    error: {
      message: err.message || "An unknown error occurred.",
      status: err.status || 500,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
};
