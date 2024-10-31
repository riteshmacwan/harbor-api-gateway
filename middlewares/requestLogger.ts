import { Request, Response } from 'express';
import morgan from 'morgan';
import appInsightsUtils from './../utils/appInsightsUtils';
import logger from '../utils/logger';

/**
 * Configure Morgan for detailed request and response logging.
 * @param tokens - Morgan's token indexer for retrieving values from the request and response.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns The formatted log string.
 */
morgan.token('response-json', (req: Request, res: Response) => {
  return JSON.stringify(res.locals.responseJson || {});
});

export const requestLogger = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();  // Capture the request incoming time

  res.on('finish', () => {
    const endTime = Date.now();  // Capture the response outgoing time
    const duration = endTime - startTime;  // Calculate the processing duration

    const logProperties = {
      method: req.method,
      url: req.originalUrl,
      userId: (req as any)?.user?._id,
      statusCode: res.statusCode.toString(),
      contentLength: res.get('Content-Length') ?? 'undefined',
      requestPayload: JSON.stringify(req.body || req.query),
      responsePayload: JSON.stringify(res.locals.responseJson || {}),
      requestInTime: new Date(startTime).toISOString(),
      requestOutTime: new Date(endTime).toISOString(),
      processingTime: `${duration}ms`,
    };

    // Building the log message by iterating over logProperties
      const logMessage = Object.entries(logProperties).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // Add spaces before capital letters and capitalize the first letter
        return `${formattedKey}: ${value}`;
      }).join('\n');

    // Let's log the Requests to AzureAppInsights
    appInsightsUtils.logEvent("HTTP Request", logProperties);

    logger.info(logMessage);

    return null; // Morgan expects a string or null if the output is handled elsewhere
  });
  next();
};

export default requestLogger;
