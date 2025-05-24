import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigService } from "../../../src/modules/config/services/config.service.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import {
  JwtRefreshPayload,
  JwtRefreshStrategy,
} from "../../../src/modules/auth/strategies/jwt-refresh.strategy.js";
import { UserEntityRepository } from "../../../src/modules/orm/schema/repositories/user.repository.js";
import { mock } from "vitest-mock-extended";
import httpMocks from "node-mocks-http";
import { ForbiddenException } from "../../../src/modules/app/exceptions/exceptions.js";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";
import { AuthService } from "../../../src/modules/auth/auth.service.js";
import bcrypt from "bcrypt";

const mockConfigService = {
  get: vi.fn().mockImplementation((key: string) => {
    if (key === "auth.jwt.accessToken.secret") {
      return "mock-access-secret";
    }
    if (key === "auth.jwt.accessToken.expirationTime") {
      return "60s";
    }

    if (key === "auth.jwt.refreshToken.secret") {
      return "mock-refresh-secret";
    }
    if (key === "auth.jwt.refreshToken.expirationTime") {
      return "7d";
    }
    throw new Error(`Unknown config key: ${key}`);
  }),
};

const mockUserEntityRepository = mock<UserEntityRepository>();

describe(JwtRefreshStrategy.name, () => {
  let jwtRefreshStrategy: JwtRefreshStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    jwtRefreshStrategy = new JwtRefreshStrategy(
      mockConfigService as unknown as ConfigService,
      mockUserEntityRepository
    );
  });

  it("should be defined", async () => {
    expect(jwtRefreshStrategy).toBeDefined();
  });

  it("should throw forbidden if user entity is not found", async () => {
    const payload: JwtRefreshPayload = {
      sub: "a1",
    };

    mockUserEntityRepository.findOne.mockResolvedValue(null);
    const mockReq = httpMocks.createRequest();

    await expect(jwtRefreshStrategy.validate(mockReq, payload)).rejects.toThrow(
      ForbiddenException
    );
  });

  it("should throw forbidden if user entity is found but the entity has no refresh token", async () => {
    const userEntity = UserEntity.createFixture({
      refreshToken: null,
    });

    mockUserEntityRepository.findOne.mockResolvedValue(userEntity);
    const payload: JwtRefreshPayload = {
      sub: userEntity.uuid,
    };

    const mockReq = httpMocks.createRequest();
    await expect(jwtRefreshStrategy.validate(mockReq, payload)).rejects.toThrow(
      ForbiddenException
    );
  });

  it("should throw forbidden if the refresh token does not match the one in the database", async () => {
    const userEntity = UserEntity.createFixture({
      refreshToken: await bcrypt.hash("refresh-token-in-db", 10),
    });

    mockUserEntityRepository.findOne.mockResolvedValue(userEntity);
    const payload: JwtRefreshPayload = {
      sub: userEntity.uuid,
    };

    const mockReq = httpMocks.createRequest({
      headers: {
        authorization: `Bearer refresh-token-in-req`,
      },
    });

    await expect(jwtRefreshStrategy.validate(mockReq, payload)).rejects.toThrow(
      ForbiddenException
    );
  });

  it("should return the user entity if the refresh token matches", async () => {
    const userEntity = UserEntity.createFixture({
      refreshToken: await bcrypt.hash("valid-refresh-token", 10),
    });

    mockUserEntityRepository.findOne.mockResolvedValue(userEntity);
    const payload: JwtRefreshPayload = {
      sub: userEntity.uuid,
    };

    const mockReq = httpMocks.createRequest({
      headers: {
        authorization: `Bearer valid-refresh-token`,
      },
    });

    const res = await jwtRefreshStrategy.validate(mockReq, payload);
    expect(res).toEqual(userEntity);
  });
});
