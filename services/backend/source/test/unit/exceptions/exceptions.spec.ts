import { describe, expect, it } from "vitest";
import {
  BaseException,
  createExceptionClass,
  ExceptionCode,
  exceptionDataSet,
} from "../../../src/modules/app/exceptions/exceptions.js";

describe("exceptions", () => {
  it("should create an exception class for each defined exception code", () => {
    Object.keys(exceptionDataSet).forEach((code) => {
      const exceptionCode = code as ExceptionCode;
      const ExceptionClass = createExceptionClass(exceptionCode);
      const exception = new ExceptionClass();

      expect(exception.exceptionCode).toBe(exceptionCode);
      expect(exception.message).toBe(exceptionDataSet[exceptionCode].message);
      expect(exception.httpStatus).toBe(
        exceptionDataSet[exceptionCode].httpStatus
      );
      expect(typeof exception.timeStamp).toBe("string");
      expect(new Date(exception.timeStamp)).toBeInstanceOf(Date);
      expect(exception).toBeInstanceOf(BaseException);
    });
  });

  it("should name the class correctly", () => {
    const TestException = createExceptionClass(ExceptionCode.NOT_FOUND);
    expect(TestException.name).toBe("NotFoundException");
  });
});
