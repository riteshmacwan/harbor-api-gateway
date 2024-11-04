import { Router } from "express";
import { Authentication } from "../middlewares/authentication";
import {
  getSocketTargetUrl,
  handleProxyRequest,
} from "../services/proxyHandler";
import { createProxyMiddleware } from "http-proxy-middleware";
import { AuthController } from "../controllers/auth";
const authentication = new Authentication();
const authController = new AuthController();

const router = Router();

/**
 * Define routes and associate them with middleware and services.
 */
// router.get("/login", authentication.login);
router.post("/signup", authController.signUp);
router.post("/login", authController.signUp);

router.use(
  "/patient-manage/last-incoming-message-status/:email",
  handleProxyRequest
); // Example route without authentication
router.use("/notifications/twilio-sms-webhook", handleProxyRequest); // Example route without authentication
router.use("/notifications/verify-gmail", handleProxyRequest); // Example route without authentication
router.use("/notifications/verify-group", handleProxyRequest); // Example route without authentication
router.use("/notifications/sengrid-email-webhook", handleProxyRequest); // Another route without authentication
router.use("/notifications/sendgrid-event", handleProxyRequest); // Another route without authentication
router.use("/notifications/twilio-sms-delivery-event", handleProxyRequest); // Another route without authentication
router.use(
  "/patient-manage/fetch-patient-by-number/:phone_number",
  handleProxyRequest
); // Example route without authentication
router.use(
  "/mass-com/communication/patient-status-webhook",
  handleProxyRequest
);
router.use("/notifications/save-phone-history", handleProxyRequest); // Example route without authentication
router.use("/patient-manage/save-call-recording/:call_sid", handleProxyRequest); // Example route without authentication

router.use(
  "/socket.io",
  createProxyMiddleware({
    router: async function () {
      const url =
        (await getSocketTargetUrl()) || "http://localhost:3003/socket.io";
      return url;
    },
    ws: true,
    changeOrigin: true,
    prependPath: true,
  })
);
// router.use("/*", authentication.verifyToken, handleProxyRequest);

export default router;
