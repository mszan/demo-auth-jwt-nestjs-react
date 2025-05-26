import { GUARDS_METADATA } from "@nestjs/common/constants.js";
import { Reflector } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import httpMocks from "node-mocks-http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock, mockFn, MockProxy } from "vitest-mock-extended";
import { JwtRefreshGuard } from "../../../src/modules/auth/guards/jwt-refresh.guard.js";
import { LocalGuard } from "../../../src/modules/auth/guards/local.guard.js";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { UserEntityRepository } from "../../../src/modules/orm/schema/repositories/user.repository.js";
import { OrmModuleMock } from "../../utils/orm.module.mock.js";
import { AuthService } from "../../../src/modules/auth/services/auth.service.js";
import { UserController } from "../../../src/modules/user/controllers/user.controller.js";
import { UserService } from "../../../src/modules/user/services/user.service.js";
import { JwtPayload } from "../../../src/modules/auth/strategies/jwt.strategy.js";
import { NotFoundException } from "../../../src/modules/app/exceptions/exceptions.js";
import { JwtGuard } from "../../../src/modules/auth/guards/jwt.guard.js";

const mockUserService = mock<UserService>();

describe(UserController.name, () => {
  let userController: UserController;
  let mockUserEntityRepo: MockProxy<UserEntityRepository>;
  let userEntityFixture: UserEntity;

  beforeEach(async () => {
    vi.clearAllMocks();

    userEntityFixture = UserEntity.createFixture({
      username: "imUser",
      password: await bcrypt.hash("Test@1234", 10),
      roles: [UserRole.USER],
    });

    mockUserEntityRepo = mock<UserEntityRepository>({
      find: mockFn(),
      qb: mockFn(),
    });

    const testingModule = await Test.createTestingModule({
      imports: [OrmModuleMock],
      controllers: [UserController],
      providers: [
        {
          provide: UserEntityRepository,
          useValue: mockUserEntityRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = testingModule.get(UserController);
  });

  describe(UserController.prototype.getUserDetails.name, () => {
    it("should have jwt guard applied to the route handler", () => {
      const reflector = new Reflector();
      const guards = reflector.get(
        GUARDS_METADATA,
        UserController.prototype.getUserDetails
      );
      const hasJwtGuard = guards.some((guard: unknown) => guard === JwtGuard);
      expect(hasJwtGuard).toBe(true);
    });

    it("should return user", async () => {
      const jwtPayload: JwtPayload = {
        sub: userEntityFixture.uuid,
        username: userEntityFixture.username,
        roles: userEntityFixture.roles,
      };
      mockUserService.getUserDto.mockResolvedValue(userEntityFixture.toDto());
      expect(await userController.getUserDetails(jwtPayload)).toStrictEqual({
        uuid: userEntityFixture.uuid,
        username: userEntityFixture.username,
        roles: userEntityFixture.roles,
      });
    });

    it("should throw not found if user is not found", async () => {
      mockUserService.getUserDto.mockRejectedValue(new NotFoundException());
      const jwtPayload: JwtPayload = {
        sub: "non-existent-uuid",
        username: "nonExistentUser",
        roles: [UserRole.USER],
      };

      await expect(userController.getUserDetails(jwtPayload)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
