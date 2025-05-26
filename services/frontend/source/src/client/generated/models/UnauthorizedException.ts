/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExceptionCode } from './ExceptionCode';
export type UnauthorizedException = {
    /**
     * Internal exception code.
     */
    exceptionCode: ExceptionCode;
    /**
     * Detailed description of an exception.
     */
    message: string;
    /**
     * HTTP status of an exception.
     */
    httpStatus: number;
    /**
     * Date in ISO 8601.
     */
    timeStamp: string;
};

