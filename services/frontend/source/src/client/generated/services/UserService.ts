/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get user details
     * @returns void
     * @throws ApiError
     */
    public static userControllerGetUserDetails(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/user/details',
        });
    }
}
