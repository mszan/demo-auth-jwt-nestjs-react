import * as jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it } from "vitest";
import { JwtRefreshGuard } from "../../../src/modules/auth/guards/jwt-refresh.guard.js";
import {
  JwtExpiredException,
  JwtMalformedException,
  JwtMissingException,
} from "../../../src/modules/app/exceptions/exceptions.js";

describe(JwtRefreshGuard.name, () => {
  let refreshTokenGuard: JwtRefreshGuard;

  beforeEach(() => {
    refreshTokenGuard = new JwtRefreshGuard();
  });

  it("should throw when token is missing", () => {
    expect(() =>
      refreshTokenGuard.handleRequest(null, null, {
        message: "No auth token",
      })
    ).toThrow(JwtMissingException);
  });

  it("should throw when token is expired", () => {
    const expiredError = new jwt.TokenExpiredError("anything", new Date());
    expect(() =>
      refreshTokenGuard.handleRequest(null, null, expiredError)
    ).toThrow(JwtExpiredException);
  });

  it("should throw when token is malformed", () => {
    const malformedError = new jwt.JsonWebTokenError("anything");
    expect(() =>
      refreshTokenGuard.handleRequest(null, null, malformedError)
    ).toThrow(JwtMalformedException);
  });

  it("should throw when an unexpected error occurs", () => {
    const unexpectedError = new Error("anything");
    expect(() =>
      refreshTokenGuard.handleRequest(unexpectedError, null, null)
    ).toThrow(unexpectedError);
  });

  it("should return the user if no error is present", () => {
    const user = { id: "a1" };
    expect(refreshTokenGuard.handleRequest(null, user, null)).toEqual(user);
  });

  it("should throw when user is not found", () => {
    expect(() => refreshTokenGuard.handleRequest(null, null, null)).toThrow(
      JwtMissingException
    );
  });
});
