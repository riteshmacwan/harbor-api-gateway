import appInsightsUtils from "./utils/appInsightsUtils";
import express from "express";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import routes from "./routes";
import cors from "cors";
import { connectMongoDb } from "./config/mongodb";

appInsightsUtils.logMessage("API Gateway: Application is starting...");

const app = express();
const HOST = process.env.HOST_URL ?? "localhost";
const PORT = process.env.HOST_PORT ?? 3000;

// enable cors
app.use(cors());
app.options("*", cors());

// Hide Express server information
app.disable("x-powered-by");

// Setup Swagger
setupSwagger(app);

// Use custom request logger
app.use(requestLogger);

// connectMssqlDb();
//connect mongodb
connectMongoDb();

// Health Check Route
app.get("/health-check", (req, res) => {
  res.status(200).json({ health: "okay" });
});

// API routes
app.use("/", routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

export default app;
