import { GUARDS_METADATA } from "@nestjs/common/constants.js";
import { Reflector } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import httpMocks from "node-mocks-http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, mockFn, MockProxy } from "vitest-mock-extended";
import { AuthController } from "../../../src/modules/auth/auth.controller.js";
import { AuthService } from "../../../src/modules/auth/auth.service.js";
import { JwtRefreshGuard } from "../../../src/modules/auth/guards/jwt-refresh.guard.js";
import { LocalGuard } from "../../../src/modules/auth/guards/local.guard.js";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { UserEntityRepository } from "../../../src/modules/orm/schema/repositories/user.repository.js";
import { OrmModuleMock } from "../../utils/orm.module.mock.js";

const mockAuthService = mock<AuthService>();

describe(AuthController.name, () => {
  let authController: AuthController;
  let mockUserEntityRepo: MockProxy<UserEntityRepository>;
  let userEntityFixture: UserEntity;

  beforeEach(async () => {
    vi.clearAllMocks();

    userEntityFixture = UserEntity.createFixture({
      username: "imUser",
      password: bcrypt.hashSync("Test@1234", 10),
      roles: [UserRole.USER],
    });

    mockUserEntityRepo = mock<UserEntityRepository>({
      find: mockFn(),
      qb: mockFn(),
    });

    const testingModule = await Test.createTestingModule({
      imports: [OrmModuleMock, PassportModule],
      controllers: [AuthController],
      providers: [
        {
          provide: UserEntityRepository,
          useValue: mockUserEntityRepo,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = testingModule.get(AuthController);
  });

  describe(AuthController.prototype.login.name, () => {
    it("should complete the request", async () => {
      const mockReq = httpMocks.createRequest();
      mockReq.user = userEntityFixture;

      mockAuthService.login.mockResolvedValue({
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });

      const res = await authController.login(mockReq as never);

      expect(res).toEqual({
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });
      expect(mockAuthService.login).toHaveBeenCalledExactlyOnceWith(
        userEntityFixture
      );
    });

    it("should have local guard applied to the route handler", () => {
      const reflector = new Reflector();
      const guards = reflector.get(
        GUARDS_METADATA,
        AuthController.prototype.login
      );
      const hasLocalGuard = guards.some(
        (guard: unknown) => guard === LocalGuard
      );
      expect(hasLocalGuard).toBe(true);
    });
  });

  describe(AuthController.prototype.refreshTokens.name, () => {
    it("should complete the request", async () => {
      const mockReq = httpMocks.createRequest();
      mockReq.user = userEntityFixture;
      mockAuthService.login.mockResolvedValue({
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });

      const res = await authController.refreshTokens(mockReq as never);
      expect(res).toEqual({
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });
      expect(mockAuthService.login).toHaveBeenCalledExactlyOnceWith(
        userEntityFixture
      );
    });

    it("should have jwt refresh guard applied to the route handler", () => {
      const reflector = new Reflector();
      const guards = reflector.get(
        GUARDS_METADATA,
        AuthController.prototype.refreshTokens
      );
      const hasJwtRefreshGuard = guards.some(
        (guard: unknown) => guard === JwtRefreshGuard
      );
      expect(hasJwtRefreshGuard).toBe(true);
    });
  });
});
