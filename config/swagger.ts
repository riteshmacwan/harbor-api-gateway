import { Express } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

/**
 * Sets up Swagger documentation.
 * @param app - The Express application
 */
export const setupSwagger = (app: Express): void => {
  const specs = swaggerJsDoc(swaggerDocument);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
};
