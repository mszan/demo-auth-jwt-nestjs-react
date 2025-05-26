import { Controller, Inject, Post, Req } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { ApiTagsTypeSafe } from "../../app/decorators/api-tags-type-safe.decorator.js";
import { ApplyApiInternalServiceExceptionResponse } from "../../app/decorators/apply-api-internal-service-exception-response.decorator.js";
import { UserEntity } from "../../orm/schema/entities/user.entity.js";
import { ApplyJwtRefreshGuard } from "../decorators/apply-jwt-refresh-guard.decorator.js";
import { ApplyLocalGuard } from "../decorators/apply-local-guard.decorator.js";
import { LoginLocalInputDto } from "../dto/input/login-local-input.dto.js";
import { JwtLoginResDto } from "../dto/res/jwt-login-res.dto.js";
import { AuthService } from "../services/auth.service.js";

@ApplyApiInternalServiceExceptionResponse()
@ApiTagsTypeSafe("auth")
@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Login user" })
  @ApiOkResponse({ type: JwtLoginResDto })
  @ApiBody({ required: true, type: LoginLocalInputDto })
  @ApplyLocalGuard()
  @Post("login")
  async login(
    @Req() req: Request & { user: UserEntity }
  ): Promise<JwtLoginResDto> {
    // please note what's happening in the preceding guard and corresponding strategy
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "Refresh tokens" })
  @ApiOkResponse({ type: JwtLoginResDto })
  @ApplyJwtRefreshGuard()
  @Post("refresh-tokens")
  async refreshTokens(
    @Req() req: Request & { user: UserEntity }
  ): Promise<JwtLoginResDto> {
    // please note what's happening in the preceding guard and corresponding strategy
    return this.authService.login(req.user);
  }
}
