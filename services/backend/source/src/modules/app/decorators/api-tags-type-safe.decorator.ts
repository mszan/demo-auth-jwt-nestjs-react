import { applyDecorators } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SwaggerTagName } from "../../config/config.types.js";

/**
 * Just like regular NestJS' @ApiTags but with custom typings.
 */
export function ApiTagsTypeSafe(...tags: SwaggerTagName[]): MethodDecorator & ClassDecorator {
  return applyDecorators(ApiTags(...tags));
}
