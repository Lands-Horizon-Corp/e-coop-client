import {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

import { httpClient, requestGeolocation } from './client'
import { streamer } from './streamer'

export interface IRequestParams {
    [key: string]: unknown
}

const API = {
    getHttpClient: (): AxiosInstance => httpClient,
    requestGeolocation,
    addRequestInterceptor(
        onFulfilled?: (
            value: InternalAxiosRequestConfig
        ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
        onRejected?: (error: unknown) => Promise<never> | undefined
    ): number {
        return httpClient.interceptors.request.use(onFulfilled, onRejected)
    },
    addResponseInterceptor(
        onFulfilled?: (
            value: AxiosResponse
        ) => AxiosResponse | Promise<AxiosResponse>,
        onRejected?: (error: unknown) => Promise<never> | undefined
    ): number {
        return httpClient.interceptors.response.use(onFulfilled, onRejected)
    },
    async get<R = unknown>(
        url: string,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return httpClient.get<R>(url, { params, ...config })
    },

    async post<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return httpClient.post<R>(url, data, { params, ...config })
    },

    async patch<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return httpClient.patch<R>(url, data, { params, ...config })
    },

    async put<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return httpClient.put<R>(url, data, { params, ...config })
    },

    async delete<R = unknown>(
        url: string,
        data?: object,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return httpClient.delete<R>(url, { data, params, ...config })
    },

    async uploadFile<R = unknown>(
        url: string,
        formData: FormData,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return httpClient.post<R>(url, formData, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        })
    },
    streamer,
}

export default API
