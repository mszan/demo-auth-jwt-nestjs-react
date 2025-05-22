import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

type ReqLog = {
  type: "req";
  method: string;
  baseUrl: string;
};

type ResLog = {
  type: "res";
  baseUrl: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
};

export const RESPONSE_ERROR_SYMBOL = Symbol("RESPONSE_ERROR");

/** Logger for HTTP requests and responses. */
@Injectable()
export class ReqResLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ReqResLogMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const reqAt = Date.now();
    const { method, baseUrl } = req;
    const reqLog: ReqLog = { type: "req", method, baseUrl };

    this.logger.log(reqLog);

    res.on("close", async () => {
      const resLog: ResLog = {
        type: "res",
        baseUrl,
        method,
        path: res?.req?.route?.path || req.path,
        statusCode: res.statusCode,
        responseTime: Date.now() - reqAt,
      };

      this.logger.log(resLog);
    });

    next();
    return;
  }
}
