import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { CommonUtils } from "./../utils/common";

class ServiceMap {
  private static instance: ServiceMap;
  private serviceMap: { [key: string]: string };
  private isMapInitialized: boolean = false;
  private commonUtils = CommonUtils.getInstance();

  private constructor() {}

  public static getInstance(): ServiceMap {
    if (!ServiceMap.instance) {
      ServiceMap.instance = new ServiceMap();
    }
    return ServiceMap.instance;
  }

  private async getServiceUrl(key: string, localUrl: string): Promise<string> {
    const isLocal = process.env.NODE_ENV === "local";
    return isLocal
      ? localUrl
      : await this.commonUtils.getSecret(`${process.env.NODE_ENV}-${key}`);
  }

  public async initializeServiceMap(): Promise<void> {
    if (!this.isMapInitialized) {
      this.serviceMap = {
        "/user": await this.getServiceUrl("user-url", "http://localhost:3001"),

        "/notifications": await this.getServiceUrl(
          "notifications-url",
          "http://localhost:3003"
        ),
      };
      this.isMapInitialized = true;
    }
  }

  public getEndpointUrl(basePath: string): string | undefined {
    return this.serviceMap[basePath];
  }

  public async getWebSocketEndpointUrl(): Promise<string | undefined> {
    return await this.getServiceUrl(
      "notifications-url",
      "http://localhost:3003"
    );
  }
}

/**
 * Middleware to dynamically create proxies based on request path.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export const handleProxyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceMap = ServiceMap.getInstance();
  await serviceMap.initializeServiceMap();
  const basePath = "/" + req.originalUrl.split("/")[1]; // Extracts the base part of the path to match keys in serviceMap
  const targetPath = req.originalUrl.split("?")[0]; // Split and take the first part to remove the query string
  const targetUrl = serviceMap.getEndpointUrl(basePath);
  if (!targetUrl) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  console.log(`Proxy TO End point: ${targetUrl}${targetPath}`);

  // Create a proxy middleware instance for the target URL
  const proxy = createProxyMiddleware({
    target: `${targetUrl}${targetPath}`,
    changeOrigin: true,
    prependPath: true,
  });

  // Use the proxy middleware
  proxy(req, res, next);
};

export const getSocketTargetUrl = async () => {
  const serviceMap = ServiceMap.getInstance();
  await serviceMap.initializeServiceMap();
  const targetUrl = await serviceMap.getWebSocketEndpointUrl();
  return `${targetUrl}/socket.io`;
};
