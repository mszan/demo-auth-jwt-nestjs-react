import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

// todo: add test case: fix swagger multiple responses for same http status code
export type ExceptionData = {
  httpStatus: HttpStatus;
  exceptionCode: ExceptionCode;
  message: string;
};

export enum ExceptionCode {
  FORBIDDEN = "FORBIDDEN",
  INTERNAL = "INTERNAL",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  JWT_MISSING = "JWT_MISSING",
  JWT_EXPIRED = "JWT_EXPIRED",
  JWT_MALFORMED = "JWT_MALFORMED",
}

export const exceptionDataSet: { [x in ExceptionCode]: ExceptionData } = {
  INTERNAL: {
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    exceptionCode: ExceptionCode.INTERNAL,
    message: "Internal server exception.",
  },
  FORBIDDEN: {
    httpStatus: HttpStatus.FORBIDDEN,
    exceptionCode: ExceptionCode.FORBIDDEN,
    message: "Forbidden.",
  },
  UNAUTHORIZED: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    exceptionCode: ExceptionCode.UNAUTHORIZED,
    message: "Unauthorized.",
  },
  NOT_FOUND: {
    httpStatus: HttpStatus.NOT_FOUND,
    exceptionCode: ExceptionCode.NOT_FOUND,
    message: "Resource not found.",
  },
  JWT_MISSING: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    exceptionCode: ExceptionCode.JWT_MISSING,
    message: "JWT missing.",
  },
  JWT_EXPIRED: {
    httpStatus: HttpStatus.FORBIDDEN,
    exceptionCode: ExceptionCode.JWT_EXPIRED,
    message: "JWT expired.",
  },
  JWT_MALFORMED: {
    httpStatus: HttpStatus.BAD_REQUEST,
    exceptionCode: ExceptionCode.JWT_MALFORMED,
    message: "JWT malformed.",
  },
};

export abstract class BaseException {
  timeStamp: string;
  exceptionCode: ExceptionCode;
  message: string;
  httpStatus: HttpStatus;

  constructor(code: ExceptionCode) {
    const data = exceptionDataSet[code];

    this.exceptionCode = data.exceptionCode;
    this.message = data.message;
    this.httpStatus = data.httpStatus;
    this.timeStamp = new Date().toISOString();
  }
}

export function createExceptionClass(exceptionCode: ExceptionCode) {
  class CustomException extends BaseException {
    @ApiProperty({
      description: "Internal exception code.",
      enum: ExceptionCode,
      enumName: "ExceptionCode",
      default: exceptionCode,
    })
    declare exceptionCode: ExceptionCode;

    @ApiProperty({
      description: "Detailed description of an exception.",
      default: <string>exceptionDataSet[exceptionCode].message,
      type: () => String,
    })
    declare message: string;

    @ApiProperty({
      description: "HTTP status of an exception.",
      default: <HttpStatus>exceptionDataSet[exceptionCode].httpStatus,
      format: "int32",
      type: "integer",
    })
    declare httpStatus: HttpStatus;

    @ApiProperty({
      default: new Date().toISOString(),
      description: "Date in ISO 8601.",
      type: () => String,
    })
    declare timeStamp: string;

    constructor() {
      super(exceptionCode);
    }
  }

  // convert snake_case to PascalCase
  const className =
    exceptionCode
      .split("_")
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join("") + "Exception";

  Object.defineProperty(CustomException, "name", {
    value: className,
  });

  return CustomException;
}

// create exception classes for each exception codex
export const ExceptionsMap = Object.values(ExceptionCode).reduce(
  (acc, code) => {
    acc[code] = createExceptionClass(code);
    return acc;
  },
  {} as Record<ExceptionCode, ReturnType<typeof createExceptionClass>>
);

export const allExceptions = Object.values(ExceptionsMap);

export const NotFoundException = ExceptionsMap.NOT_FOUND;
export const InternalException = ExceptionsMap.INTERNAL;
export const UnauthorizedException = ExceptionsMap.UNAUTHORIZED;
export const ForbiddenException = ExceptionsMap.FORBIDDEN;
export const JwtMissingException = ExceptionsMap.JWT_MISSING;
export const JwtExpiredException = ExceptionsMap.JWT_EXPIRED;
export const JwtMalformedException = ExceptionsMap.JWT_MALFORMED;
