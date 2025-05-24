import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { LocalStrategy } from "../../../src/modules/auth/strategies/local.strategy.js";
import { UserEntityRepository } from "../../../src/modules/orm/schema/repositories/user.repository.js";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";
import bcrypt from "bcrypt";
import { UnauthorizedException } from "../../../src/modules/app/exceptions/exceptions.js";

describe(LocalStrategy.name, () => {
  let mockUserEntityRepository = mock<UserEntityRepository>();
  let localStrategy: LocalStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    localStrategy = new LocalStrategy(mockUserEntityRepository);
  });

  it("should be defined", async () => {
    expect(localStrategy).toBeDefined();
  });

  it("should return the user entity if the username and password are valid", async () => {
    const userEntity = UserEntity.createFixture({
      username: "imUser",
      password: bcrypt.hashSync("Test@1234", 10),
      roles: [UserRole.USER],
    });

    mockUserEntityRepository.findOne.mockResolvedValue(userEntity);

    const res = await localStrategy.validate(userEntity.username, "Test@1234");

    expect(res).toEqual(userEntity);
  });

  it("should throw unauthorized if the username is invalid", async () => {
    mockUserEntityRepository.findOne.mockResolvedValue(null);

    await expect(
      localStrategy.validate("invalidUsername", "Test@1234")
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw unauthorized if the password is invalid", async () => {
    const userEntity = UserEntity.createFixture({
      username: "imUser",
      password: bcrypt.hashSync("Test@1234", 10),
      roles: [UserRole.USER],
    });

    mockUserEntityRepository.findOne.mockResolvedValue(userEntity);
  });
});
