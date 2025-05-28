import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "../../config/services/config.service.js";
import { UserRole } from "../../orm/schema/enums/user-role.js";

export type JwtPayload = {
  /** subject - user uuid in this case */
  sub: string;
  username: string;
  roles: UserRole[];
};

/**
 * This strategy is used to authenticate and authorize users using a JWT access token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.get(
        "auth.jwt.accessToken.ignoreExpiration"
      ),
      secretOrKey: configService.get("auth.jwt.accessToken.secret"),
    });
  }

  /**
   * Passport first verifies the JWT's signature and decodes the JSON. It then invokes this method passing the decoded JSON as its single parameter.
   * Based on the way JWT signing works, we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
   *
   * As a result of all this, our response to the validate() callback is trivial: we simply return an object containing the payload.
   * Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
   */
  validate(payload: JwtPayload) {
    return payload;
  }
}
