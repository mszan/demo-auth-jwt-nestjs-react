import * as jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JwtGuard } from "../../../src/modules/auth/guards/jwt.guard.js";
import {
  ForbiddenException,
  JwtExpiredException,
  JwtMalformedException,
  JwtMissingException,
  UnauthorizedException,
} from "../../../src/modules/app/exceptions/exceptions.js";
import { Reflector } from "@nestjs/core";
import { mock } from "vitest-mock-extended";
import { ExecutionContext } from "@nestjs/common";
import httpMocks from "node-mocks-http";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { JwtPayload } from "../../../src/modules/auth/strategies/jwt.strategy.js";
import { UserEntity } from "../../../src/modules/orm/schema/entities/user.entity.js";

const mockReflector = mock<Reflector>();
const mockExecutionContextGetRequest = vi.fn();
const mockExecutionContext = {
  getHandler: () => null,
  getClass: () => null,
  switchToHttp: () => ({
    getRequest: mockExecutionContextGetRequest,
  }),
} as unknown as ExecutionContext;

describe(JwtGuard.name, () => {
  let jwtGuard: JwtGuard;

  beforeEach(() => {
    vi.clearAllMocks();
    jwtGuard = new JwtGuard(mockReflector);
  });

  it("should allow access if no roles are required", async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce([]);
    expect(await jwtGuard.canActivate(mockExecutionContext)).toBe(true);

    mockReflector.getAllAndOverride.mockReturnValueOnce(null);
    expect(await jwtGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it("should throw unauthorized when token is missing and roles are required", async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce([UserRole.ADMIN]);

    mockExecutionContextGetRequest.mockImplementationOnce(() => ({
      ...httpMocks.createRequest(),
      user: null,
    }));

    await expect(jwtGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("should throw jwt malformed when token has no roles", async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce([UserRole.ADMIN]);

    const invalidJwtPayload = {
      uuid: "123",
    };

    mockExecutionContextGetRequest.mockImplementationOnce(() => ({
      ...httpMocks.createRequest(),
      user: invalidJwtPayload,
    }));

    await expect(jwtGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      JwtMalformedException
    );
  });

  it("should throw forbidden when user doesn't have required roles", async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce([UserRole.ADMIN]);

    const jwtPayload: JwtPayload = {
      sub: "a1",
      username: "anything",
      roles: [UserRole.USER],
    };
    mockExecutionContextGetRequest.mockImplementationOnce(() => ({
      ...httpMocks.createRequest(),
      user: jwtPayload,
    }));

    await expect(jwtGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      ForbiddenException
    );
  });

  it("should allow access when user has all required roles", async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce([
      UserRole.ADMIN,
      UserRole.USER,
    ]);

    const jwtPayload: JwtPayload = {
      sub: "a1",
      username: "anything",
      roles: [UserRole.USER, UserRole.ADMIN],
    };
    mockExecutionContextGetRequest.mockImplementationOnce(() => ({
      ...httpMocks.createRequest(),
      user: jwtPayload,
    }));

    expect(await jwtGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it("should allow access when user has more roles than required", async () => {
    mockReflector.getAllAndOverride.mockReturnValueOnce([UserRole.USER]);

    const jwtPayload: JwtPayload = {
      sub: "a1",
      username: "anything",
      roles: [UserRole.USER, UserRole.ADMIN],
    };
    mockExecutionContextGetRequest.mockImplementationOnce(() => ({
      ...httpMocks.createRequest(),
      user: jwtPayload,
    }));

    expect(await jwtGuard.canActivate(mockExecutionContext)).toBe(true);
  });
});
