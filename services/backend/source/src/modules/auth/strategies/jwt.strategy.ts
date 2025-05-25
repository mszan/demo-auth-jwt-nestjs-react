import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "../../config/services/config.service.js";
import { UserRole } from "../../orm/schema/enums/user-role.js";

export type JwtPayload = {
  sub: string; // subject - user uuid
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

  // todo: add description
  validate(payload: JwtPayload) {
    return payload;
  }
}
