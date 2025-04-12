import { AxiosRequestConfig } from 'axios'

export interface IRequestParams {
    [key: string]: unknown
}

export interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
    retryCount?: number
}

export interface IErrorResponse {
    error?: string
    message?: string
}
