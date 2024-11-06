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
 * Routes without authentication
 */
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a user in harbor
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Register a user in harbor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   platform:
 *                     type: string
 *                     description: web | app
 *                     example: web
 *                   google_id?:
 *                     type: string
 *                     description: user's google id
 *                   apple_id?:
 *                     type: string
 *                     description: user's apple id
 *                   country_code?:
 *                     type: string
 *                     description: user's country code
 *                   phone_number?:
 *                     type: string
 *                     description: user's phone number
 */
router.post("/signup", validateAuthBody, validation, authController.signUp);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user in harbor
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login a user in harbor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   platform:
 *                     type: string
 *                     description: web | app
 *                     example: web
 *                   google_id?:
 *                     type: string
 *                     description: user's google id
 *                   apple_id?:
 *                     type: string
 *                     description: user's apple id
 *                   country_code?:
 *                     type: string
 *                     description: user's country code
 *                   phone_number?:
 *                     type: string
 *                     description: user's phone number
 */
router.post("/login", validateAuthBody, validation, authController.login);
router.use("/user/list-skill", handleProxyRequest);
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout a user from harbor
 *         content:
 *           application/json:
 */
router.get("/logout", authentication.verifyToken, authController.logout);

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
