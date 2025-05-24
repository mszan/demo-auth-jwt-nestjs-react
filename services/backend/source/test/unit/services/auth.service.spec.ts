import { JwtModule } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { AuthService } from "../../../src/modules/auth/auth.service.js";
import { ConfigService } from "../../../src/modules/config/services/config.service.js";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { UserEntityRepository } from "../../../src/modules/orm/schema/repositories/user.repository.js";

// Mock the MikroORM wrap function at the module level
vi.mock("@mikro-orm/core", async () => {
  const actual = await vi.importActual("@mikro-orm/core");
  return {
    ...actual,
    wrap: vi.fn().mockImplementation((entity) => {
      return {
        isInitialized: vi.fn().mockReturnValue(false),
        init: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe(AuthService.name, () => {
  let service: AuthService;
  let mockConfigService: ConfigService;
  let mockUserEntityRepository = mock<UserEntityRepository>();
  let mockEntityManager: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockEntityManager = {
      persistAndFlush: vi.fn().mockResolvedValue(undefined),
    };

    mockUserEntityRepository = mock<UserEntityRepository>({
      getReference: vi.fn().mockImplementation((uuid) => {
        const mockUser = new UserEntity();
        mockUser.uuid = uuid;
        return mockUser;
      }),
      getEntityManager: vi.fn().mockReturnValue(mockEntityManager),
    });

    mockConfigService = {
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
    } as unknown as ConfigService;

    const testingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UserEntityRepository,
          useValue: mockUserEntityRepository,
        },
      ],
    }).compile();

    service = testingModule.get(AuthService);
  });

  describe(AuthService.prototype["generateUserTokens"], () => {
    it("should generate access and refresh tokens for the user", async () => {
      const user: Pick<UserEntity, "uuid" | "username" | "roles"> = {
        uuid: "user-uuid",
        username: "testuser",
        roles: [UserRole.USER],
      };

      const tokens = await service["generateUserTokens"](user);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
      const decodedTokens = {
        accessToken: service["jwtService"].decode(tokens.accessToken),
        refreshToken: service["jwtService"].decode(tokens.refreshToken),
      };
      expect(decodedTokens.accessToken).toMatchObject({
        sub: user.uuid,
        username: user.username,
        roles: user.roles,
      });
      expect(decodedTokens.refreshToken).toMatchObject({
        sub: user.uuid,
      });
    });
  });

  describe(AuthService.prototype["updateRefreshTokenInDb"], () => {
    it("should update the refresh token for the user", async () => {
      const userUuid = "test-uuid";
      const refreshToken = "new-refresh-token";

      await service["updateRefreshTokenInDb"](userUuid, refreshToken);

      expect(mockUserEntityRepository.getReference).toHaveBeenCalledWith(
        userUuid
      );
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: userUuid,
          refreshToken: expect.any(String),
        })
      );
    });

    it("should set refresh token to null if provided", async () => {
      const userUuid = "test-uuid";

      await service["updateRefreshTokenInDb"](userUuid, null);

      expect(mockUserEntityRepository.getReference).toHaveBeenCalledWith(
        userUuid
      );
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: userUuid,
          refreshToken: null,
        })
      );
    });
  });

  describe(AuthService.prototype.login, () => {
    it("should generate tokens and update the refresh token in the database", async () => {
      const userEntity = UserEntity.createFixture({
        username: "testuser",
        roles: [UserRole.USER],
      });
      const tokens = await service.login(userEntity);
      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");

      const decodedAccessToken = service["jwtService"].decode(
        tokens.accessToken
      );
      expect(decodedAccessToken).toMatchObject({
        sub: userEntity.uuid,
        username: userEntity.username,
        roles: userEntity.roles,
      });

      expect(mockUserEntityRepository.getReference).toHaveBeenCalledWith(
        userEntity.uuid
      );
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: userEntity.uuid,
          refreshToken: expect.any(String),
        })
      );
    });
  });
});
