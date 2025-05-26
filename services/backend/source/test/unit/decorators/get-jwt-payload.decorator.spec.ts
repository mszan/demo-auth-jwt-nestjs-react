import { ExecutionContext } from "@nestjs/common";
import httpMocks from "node-mocks-http";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { InternalException } from "../../../src/modules/app/exceptions/exceptions.js";
import { decoratorCallback } from "../../../src/modules/auth/decorators/get-jwt-payload.decorator.js";
import { UserRole } from "../../../src/modules/orm/schema/enums/user-role.js";
import { JwtPayload } from "../../../src/modules/auth/strategies/jwt.strategy.js";

describe("GetJwtPayload", () => {
  let mockExecutionContext: ExecutionContext;
  let mockGetRequest: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRequest = vi.fn();

    mockExecutionContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: mockGetRequest,
      }),
    } as unknown as ExecutionContext;
  });

  it("should extract and return the jwt payload from the request", () => {
    const jwtPayload: JwtPayload = {
      sub: "a1",
      roles: [UserRole.USER],
      username: "anything",
    };

    mockGetRequest.mockReturnValue(
      httpMocks.createRequest({
        user: jwtPayload,
      })
    );

    const res = decoratorCallback(mockExecutionContext);
    expect(mockGetRequest).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    expect(res).toEqual(jwtPayload);
  });

  it("should throw internal if jwt payload is not present in the request", () => {
    mockGetRequest.mockReturnValue(
      httpMocks.createRequest({
        user: null,
      })
    );

    expect(() => decoratorCallback(mockExecutionContext)).toThrow(
      InternalException
    );
    expect(mockGetRequest).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
  });
});
