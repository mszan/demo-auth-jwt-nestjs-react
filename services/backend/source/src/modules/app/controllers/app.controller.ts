import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiTagsTypeSafe } from "../decorators/api-tags-type-safe.decorator.js";
import { ApplyApiInternalServiceExceptionResponse } from "../decorators/apply-api-internal-service-exception-response.decorator.js";

@ApiTagsTypeSafe("app")
@ApplyApiInternalServiceExceptionResponse()
@Controller("")
export class AppController {
  @ApiOperation({
    summary: "Check application health",
    description:
      "Check whether application has started successfully and is ready to process incomming requests.",
  })
  @Get("healthcheck")
  getHealthcheck() {
    return {
      status: "UP",
    };
  }
}
