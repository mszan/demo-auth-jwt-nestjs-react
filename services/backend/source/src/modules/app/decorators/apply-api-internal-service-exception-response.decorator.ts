import { applyDecorators } from "@nestjs/common";
import { ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { InternalException } from "../../app/exceptions/exceptions.js";

export function ApplyApiInternalServiceExceptionResponse() {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      type: InternalException,
    }),
  );
}
