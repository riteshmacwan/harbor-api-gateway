import { Router } from "express";
import { Authentication } from "../middlewares/authentication";
import {
  getSocketTargetUrl,
  handleProxyRequest,
} from "../services/proxyHandler";
import { createProxyMiddleware } from "http-proxy-middleware";
import { AuthController } from "../controllers/auth";
import { validateAuthBody, validation } from "../middlewares/validations/auth";
const authentication = new Authentication();
const authController = new AuthController();

const router = Router();

/**
 * Define routes and associate them with middleware and services.
 */
router.post("/signup", validateAuthBody, validation, authController.signUp);
router.post("/login", validateAuthBody, validation, authController.login);

/**
 * Routes without authentication
 */
router.use("/user/list-skill", handleProxyRequest);

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
router.use("/*", authentication.verifyToken, handleProxyRequest);

export default router;
