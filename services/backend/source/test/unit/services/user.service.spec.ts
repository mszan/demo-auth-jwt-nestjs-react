import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { UserEntityRepository } from "../../../src/modules/orm/schema/repositories/user.repository.js";
import { UserService } from "../../../src/modules/user/services/user.service.js";
import { NotFoundException } from "../../../src/modules/app/exceptions/exceptions.js";

describe(UserService.name, () => {
  let service: UserService;
  let mockUserEntityRepository = mock<UserEntityRepository>();

  beforeEach(async () => {
    vi.clearAllMocks();

    mockUserEntityRepository = mock<UserEntityRepository>({
      findOne: vi
        .fn()
        .mockImplementation(({ uuid }) => UserEntity.createFixture({ uuid })),
    });

    const testingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserEntityRepository,
          useValue: mockUserEntityRepository,
        },
      ],
    }).compile();

    service = testingModule.get(UserService);
  });

  describe(UserService.prototype.getUserDto.name, () => {
    it("should return user dto", async () => {
      const userUuid = "a1";
      const userDto = await service.getUserDto(userUuid);
      expect(userDto).toBeDefined();
      expect(userDto.uuid).toBe(userUuid);
    });

    it("should throw not found if user is not found", async () => {
      mockUserEntityRepository.findOne.mockResolvedValue(null);
      const userUuid = "non-existent-uuid";

      await expect(service.getUserDto(userUuid)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
