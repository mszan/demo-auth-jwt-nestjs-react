import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import EventEmitter from "events";
import httpMocks from "node-mocks-http";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import { ReqResLogMiddleware } from "../../../src/modules/app/middlewares/req-res-log.middleware.js";

describe(ReqResLogMiddleware.name, () => {
  let app: INestApplication;
  let reqResLogMiddleware: ReqResLogMiddleware;
  let spyLoggerLog: MockInstance;

  beforeEach(async () => {
    vi.clearAllMocks();

    const testingModule = await Test.createTestingModule({
      controllers: [],
      providers: [ReqResLogMiddleware],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
    reqResLogMiddleware = app.get(ReqResLogMiddleware);

    spyLoggerLog = vi
      .spyOn(reqResLogMiddleware["logger"], "log")
      .mockImplementation(() => {});
  });

  afterEach(async () => {
    await app.close();
    vi.restoreAllMocks();
  });

  it("should trigger the next function", async () => {
    const mockReq = httpMocks.createRequest({
      method: "GET",
      url: "/api/test",
      baseUrl: "/api",
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = vi.fn();

    await reqResLogMiddleware.use(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(spyLoggerLog).toHaveBeenCalledOnce();
  });

  it(`should log request details`, async () => {
    const mockReq = httpMocks.createRequest({
      method: "POST",
      url: "/api/users",
      baseUrl: "/api",
      foo: { bar: "baz" },
    });
    const mockRes = httpMocks.createResponse();
    const mockNext = vi.fn();

    await reqResLogMiddleware.use(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(spyLoggerLog).toHaveBeenCalledExactlyOnceWith({
      type: "req",
      method: "POST",
      baseUrl: "/api",
    });
  });

  it("should log response details when request completes", async () => {
    const mockReq = httpMocks.createRequest({
      method: "GET",
      url: "/api/products",
      baseUrl: "/api",
      path: "/products",
    });

    const mockRes = httpMocks.createResponse({
      eventEmitter: EventEmitter,
      req: {
        route: { path: "/products" },
      },
    });
    mockRes.statusCode = 200;

    const mockNext = vi.fn();

    // create a promise that resolves when the close event is handled
    const responseClosePromise = new Promise<void>((resolve) => {
      mockRes.on("close", () => {
        resolve();
      });
    });

    await reqResLogMiddleware.use(mockReq, mockRes, mockNext);
    mockRes.emit("close");

    // wait for the event handler to complete
    await responseClosePromise;

    expect(spyLoggerLog).toHaveBeenCalledWith({
      type: "res",
      baseUrl: "/api",
      method: "GET",
      path: "/products",
      statusCode: 200,
      responseTime: expect.any(Number),
    });
  });
});
