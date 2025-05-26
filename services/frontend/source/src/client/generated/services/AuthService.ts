/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtLoginResDto } from '../models/JwtLoginResDto';
import type { LoginLocalInputDto } from '../models/LoginLocalInputDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login user
     * @param requestBody
     * @returns JwtLoginResDto
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginLocalInputDto,
    ): CancelablePromise<JwtLoginResDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Refresh tokens
     * @returns JwtLoginResDto
     * @throws ApiError
     */
    public static authControllerRefreshTokens(): CancelablePromise<JwtLoginResDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/auth/refresh-tokens',
        });
    }
}
