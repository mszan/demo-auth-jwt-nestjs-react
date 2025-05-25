import { applyDecorators, ForbiddenException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import {
  exceptionDataSet,
  InternalException,
  JwtExpiredException,
  JwtMalformedException,
  JwtMissingException,
  UnauthorizedException,
} from "../../app/exceptions/exceptions.js";
import { UserRole } from "../../orm/schema/enums/user-role.js";
import { JwtGuard } from "../guards/jwt.guard.js";
import { RequireRoles } from "./require-roles.decorator.js";

export function ApplyJwtGuard(requiredRoles: UserRole[]) {
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
    UseGuards(JwtGuard),
    ApiBearerAuth(),
    RequireRoles(requiredRoles)
  );
}
