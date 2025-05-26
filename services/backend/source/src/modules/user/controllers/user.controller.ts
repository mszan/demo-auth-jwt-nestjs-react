import { Controller, Get, Inject } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiTagsTypeSafe } from "../../app/decorators/api-tags-type-safe.decorator.js";
import { ApplyApiInternalServiceExceptionResponse } from "../../app/decorators/apply-api-internal-service-exception-response.decorator.js";
import { exceptionDataSet } from "../../app/exceptions/exceptions.js";
import { ApplyJwtGuard } from "../../auth/decorators/apply-jwt-guard.decorator.js";
import { GetJwtPayload } from "../../auth/decorators/get-jwt-payload.decorator.js";
import { type JwtPayload } from "../../auth/strategies/jwt.strategy.js";
import { UserRole } from "../../orm/schema/enums/user-role.js";
import { UserDto } from "../dto/user.dto.js";
import { UserService } from "../services/user.service.js";

@ApplyApiInternalServiceExceptionResponse()
@ApiTagsTypeSafe("user")
@Controller("user")
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @ApiOperation({
    summary: "Get user details",
  })
  @ApiResponse({
    status: exceptionDataSet.NOT_FOUND.httpStatus,
    type: UserDto,
  })
  @ApplyJwtGuard([UserRole.USER])
  @Get("details")
  async getUserDetails(
    @GetJwtPayload() jwtPayload: JwtPayload
  ): Promise<UserDto> {
    return await this.userService.getUserDto(jwtPayload.sub);
  }
}
