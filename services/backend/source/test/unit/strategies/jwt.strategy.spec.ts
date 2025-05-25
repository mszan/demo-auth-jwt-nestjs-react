import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  JwtPayload,
  JwtStrategy,
} from "../../../src/modules/auth/strategies/jwt.strategy.js";
import { ConfigService } from "../../../src/modules/config/services/config.service.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";

const mockConfigService = {
  get: vi.fn().mockImplementation((key: string) => {
    if (key === "auth.jwt.accessToken.ignoreExpiration") {
      return false;
    }
    if (key === "auth.jwt.accessToken.secret") {
      return "mock-secret";
    }
    throw new Error(`Unknown config key: ${key}`);
  }),
};

describe(JwtStrategy.name, () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    jwtStrategy = new JwtStrategy(
      mockConfigService as unknown as ConfigService
    );
  });

  it("should be defined", async () => {
    expect(jwtStrategy).toBeDefined();
  });

  it("should return the jwt payload", async () => {
    const payload: JwtPayload = {
      sub: "a1",
      username: "anything",
      roles: [UserRole.USER],
    };

    expect(jwtStrategy.validate(payload)).toEqual(payload);
  });
});
