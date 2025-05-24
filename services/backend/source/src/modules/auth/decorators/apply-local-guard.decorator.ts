import { applyDecorators, ForbiddenException, UseGuards } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import {
  exceptionDataSet,
  InternalException,
  JwtExpiredException,
  JwtMalformedException,
  JwtMissingException,
  UnauthorizedException,
} from "../../app/exceptions/exceptions.js";
import { LocalGuard } from "../guards/local.guard.js";

export function ApplyLocalGuard() {
  return applyDecorators(
    ApiResponse({
      status: exceptionDataSet.INTERNAL.httpStatus,
      type: InternalException,
    }),
    ApiResponse({
      status: exceptionDataSet.UNAUTHORIZED.httpStatus,
      type: UnauthorizedException,
    }),
    ApiResponse({
      status: exceptionDataSet.FORBIDDEN.httpStatus,
      type: ForbiddenException,
    }),
    ApiResponse({
      status: exceptionDataSet.JWT_MALFORMED.httpStatus,
      type: JwtMalformedException,
    }),
    ApiResponse({
      status: exceptionDataSet.JWT_EXPIRED.httpStatus,
      type: JwtExpiredException,
    }),
    ApiResponse({
      status: exceptionDataSet.JWT_MISSING.httpStatus,
      type: JwtMissingException,
    }),
    UseGuards(LocalGuard)
  );
}
