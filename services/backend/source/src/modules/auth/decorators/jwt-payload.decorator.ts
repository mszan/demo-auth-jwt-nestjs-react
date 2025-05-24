import { createParamDecorator, ExecutionContext, Logger } from "@nestjs/common";
import { InternalException } from "../../app/exceptions/exceptions.js";
import { type JwtPayload as TJwtPayload } from "../strategies/jwt.strategy.js";

// extracted due to better testability, ideally this should be tested with e2e or integration tests
export const decoratorCallback = (ctx: ExecutionContext): TJwtPayload => {
  const logger = new Logger(JwtPayload.name);

  const req = ctx.switchToHttp().getRequest();
  const jwtPayload: TJwtPayload = req.user;

  if (!jwtPayload) {
    logger.debug(
      "JWT payload is not present in the request. Did you forget to add the JWT guard to the route handler?"
    );
    throw new InternalException();
  }

  return jwtPayload;
};

/**
 * todo: add description
 */
export const JwtPayload = createParamDecorator((_, ctx) => {
  return decoratorCallback(ctx);
});
