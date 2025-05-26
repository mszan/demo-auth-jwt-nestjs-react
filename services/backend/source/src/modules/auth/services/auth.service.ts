import { wrap } from "@mikro-orm/core";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { ConfigService } from "../../config/services/config.service.js";
import { UserEntity } from "../../orm/schema/entities/user.entity.js";
import { UserEntityRepository } from "../../orm/schema/repositories/user.repository.js";
import { JwtRefreshPayload } from "../strategies/jwt-refresh.strategy.js";
import { JwtPayload } from "../strategies/jwt.strategy.js";

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserEntityRepository)
    private readonly userEntityRepository: UserEntityRepository
  ) {}

  /**
   * Generate both access and refresh tokens for the given user.
   */
  private async generateUserTokens(
    user: Pick<UserEntity, "uuid" | "username" | "roles">
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtPayload: JwtPayload = {
      sub: user.uuid,
      username: user.username,
      roles: user.roles,
    };

    const jwtRefreshPayload: JwtRefreshPayload = {
      sub: user.uuid,
    };

    return {
      accessToken: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get("auth.jwt.accessToken.secret"),
        expiresIn: this.configService.get(
          "auth.jwt.accessToken.expirationTime"
        ),
      }),
      refreshToken: await this.jwtService.signAsync(jwtRefreshPayload, {
        secret: this.configService.get("auth.jwt.refreshToken.secret"),
        expiresIn: this.configService.get(
          "auth.jwt.refreshToken.expirationTime"
        ),
      }),
    };
  }

  /**
   * Update refresh token in the database for the given user.
   * This method also hashes the refresh token before saving it to the database.
   * @param userEntity
   * @param refreshToken
   */
  private async updateRefreshTokenInDb(
    userUuid: string,
    refreshToken: string | null
  ): Promise<void> {
    const userEntityRef = this.userEntityRepository.getReference(userUuid);

    const isEntityInitialized = wrap(userEntityRef).isInitialized();
    if (!isEntityInitialized) {
      await wrap(userEntityRef).init();
    }

    let hashedRefreshToken = null;
    if (refreshToken) {
      hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    }

    userEntityRef.refreshToken = hashedRefreshToken;
    await this.userEntityRepository
      .getEntityManager()
      .persistAndFlush(userEntityRef);
  }

  /**
   *
   */
  public async login(userEntity: UserEntity) {
    const tokens = await this.generateUserTokens(userEntity);
    await this.updateRefreshTokenInDb(userEntity.uuid, tokens.refreshToken);
    return tokens;
  }
}
