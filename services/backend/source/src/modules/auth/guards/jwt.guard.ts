import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  ForbiddenException,
  JwtMalformedException,
  UnauthorizedException,
} from "../../app/exceptions/exceptions.js";
import { ROLES_KEY } from "../decorators/require-roles.decorator.js";
import { UserRole } from "../../orm/schema/enums/user-role.js";
import { JwtPayload } from "../strategies/jwt.strategy.js";

/**
 * todo: add description, link to require-roles decorator
 */
@Injectable()
export class JwtGuard implements CanActivate {
  private logger = new Logger(JwtGuard.name);

  constructor(@Inject(Reflector) private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get required roles from the route handler
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // if no roles are required, let the user move on
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const jwtPayload = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>().user;

    // at this point we know that roles are required, so we need to check if the user actually has them

    if (!jwtPayload) {
      // should never happen due to password validating jwt in the corresponding strategy. doing it just in case
      this.logger.debug("No JWT payload.");
      throw new UnauthorizedException();
    }

    if (!jwtPayload.roles) {
      this.logger.debug("No roles in JWT payload.");
      throw new JwtMalformedException();
    }

    // check if user has all required roles
    if (!requiredRoles.every((role) => jwtPayload.roles.includes(role))) {
      this.logger.debug(
        `Roles in route handler: ${requiredRoles}. Roles in JWT payload: ${jwtPayload.roles}.`
      );
      throw new ForbiddenException();
    }

    // everything is fine, user has the required roles
    return true;
  }
}
