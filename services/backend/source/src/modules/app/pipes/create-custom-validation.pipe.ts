import { Logger, ValidationPipe } from "@nestjs/common";

// in a real world scenario this won't work - the exception factory should match this app exception convention. we should also test it widely
const logger = new Logger(ValidationPipe.name);
export function createCustomValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    disableErrorMessages: false,
    enableDebugMessages: true,
    validationError: {
      value: true,
      target: true,
    },
    transform: true,
  });
}
