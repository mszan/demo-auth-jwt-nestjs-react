import { ArgumentsHost, Catch } from "@nestjs/common";
import { Response } from "express";
import { RESPONSE_ERROR_SYMBOL } from "../../middlewares/req-res-log.middleware.js";
import { BaseException } from "../exceptions.js";

@Catch(BaseException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.httpStatus;

    const finalResponse: BaseException = {
      exceptionCode: exception.exceptionCode,
      httpStatus: exception.httpStatus,
      message: exception.message,
      timeStamp: new Date().toISOString(),
    };

    response[RESPONSE_ERROR_SYMBOL] = finalResponse;
    response.status(status).json(finalResponse);
  }
}
