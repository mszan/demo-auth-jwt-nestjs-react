import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";

// todo: adjust exception factory to match app exception design
const logger = new Logger(ValidationPipe.name);
export function createCustomValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    disableErrorMessages: false,
    enableDebugMessages: true,
    exceptionFactory: (errors: ValidationError[]) => {
      logger.debug("Validation error", errors);
      return new BadRequestException(errors);
    },
    validationError: {
      value: true,
      target: true,
    },
    transform: true,
  });
}
