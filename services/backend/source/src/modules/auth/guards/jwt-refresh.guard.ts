import { Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  JwtExpiredException,
  JwtMalformedException,
  JwtMissingException,
} from "../../app/exceptions/exceptions.js";

@Injectable()
export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {
  private readonly logger = new Logger(JwtRefreshGuard.name);

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.debug({ message: "Token error", details: err });
      throw err;
    }

    if (info) {
      if (info.message === "No auth token") {
        this.logger.debug({ message: "Token missing", details: info });
        throw new JwtMissingException();
      }

      if (info.name === "TokenExpiredError") {
        this.logger.debug({ message: "Token expired", details: info });
        throw new JwtExpiredException();
      }

      if (info.name === "JsonWebTokenError") {
        this.logger.debug({ message: "Token malformed", details: info });
        throw new JwtMalformedException();
      }
    }

    if (!user) {
      this.logger.debug({ message: "User not found", details: user });
      throw new JwtMissingException();
    }

    return user;
  }
}
