import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  exceptionDataSet,
  NotFoundException,
} from "../../../src/modules/app/exceptions/exceptions.js";
import { ExceptionFilter } from "../../../src/modules/app/exceptions/filters/exception.filter.js";

const mockJson = vi.fn();
const mockStatus = vi.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = vi.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = vi.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: vi.fn(),
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: vi.fn(),
  getArgs: vi.fn(),
  getType: vi.fn(),
  switchToRpc: vi.fn(),
  switchToWs: vi.fn(),
};

describe(ExceptionFilter.name, () => {
  let provider: ExceptionFilter;

  beforeEach(async () => {
    vi.clearAllMocks();

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [ExceptionFilter],
    }).compile();

    provider = testingModule.get<ExceptionFilter>(ExceptionFilter);
  });

  describe(ExceptionFilter.prototype.catch.name, () => {
    it("should be defined", () => {
      provider.catch(new NotFoundException(), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(exceptionDataSet.NOT_FOUND.httpStatus);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        ...exceptionDataSet.NOT_FOUND,
        timeStamp: expect.any(String),
      });
    });
  });
});
