import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "../../config/services/config.service.js";
import { AuthService } from "../auth.service.js";
import { UserEntityRepository } from "../../orm/schema/repositories/user.repository.js";
import { Request } from "express";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../../app/exceptions/exceptions.js";
import bcrypt from "bcrypt";
import { UserEntity } from "../../orm/schema/entities/user.entity.js";

export type JwtRefreshPayload = {
  sub: string; // subject - user uuid
};

const jwtExtractor = ExtractJwt.fromAuthHeaderAsBearerToken(); // todo: a bit insecure, change the extractor

/**
 * This strategy is used to authenticate and authorize users using a JWT refresh token.
 * Please note it should only authorize the user to get a new access token, not to access any actual resources.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserEntityRepository)
    private readonly userEntityRepository: UserEntityRepository
  ) {
    super({
      jwtFromRequest: jwtExtractor,
      secretOrKey: configService.get("auth.jwt.refreshToken.secret"),
      passReqToCallback: true,
    });
  }

  /**
   * Passport first verifies the JWT's signature and decodes the JSON. It then invokes this method passing the decoded JSON as its single parameter.
   * Based on the way JWT signing works, we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
   *
   * As a result of all this, our response to the validate() callback is trivial: we simply return an object containing the payload.
   * Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
   */
  async validate(
    req: Request,
    payload: JwtRefreshPayload
  ): Promise<UserEntity> {
    const userEntity = await this.userEntityRepository.findOne({
      uuid: payload.sub,
    });

    if (!userEntity) {
      this.logger.debug("User not found in the database.");
      throw new ForbiddenException();
    }

    if (!userEntity.refreshToken) {
      this.logger.debug("Refresh token not present in the database.");
      throw new ForbiddenException();
    }

    const rawRefreshToken = jwtExtractor(req)!; // we're sure the token is not null, see method description

    if (!bcrypt.compareSync(rawRefreshToken, userEntity.refreshToken)) {
      this.logger.debug(
        "Provided refresh token does not match with the one stored in a database."
      );
      throw new ForbiddenException();
    }

    return userEntity;
  }
}
