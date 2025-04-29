import axios, {
    AxiosResponse,
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios'

import { IRequestParams } from '@/types'

export default class APIService {
    private static httpClient: AxiosInstance = axios.create({
        baseURL: APIService.getDefaultUrl(),
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    })

    private static getDefaultUrl(): string {
        const environment =
            import.meta.env.VITE_HORIZON_CORP_ENVIRONMENT ||
            process.env.HORIZON_CORP_ENVIRONMENT
        switch (environment) {
            case 'local':
            case 'development':
            case 'staging':
            case 'production':
                return 'http://localhost:8080/api/v1/'
            default:
                return 'http://localhost:8080/api/v1/'
        }
    }

    public static getHttpClient(): AxiosInstance {
        return APIService.httpClient
    }

    public static addRequestInterceptor(
        onFulfilled?: (
            value: InternalAxiosRequestConfig
        ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
        onRejected?: (error: unknown) => Promise<never> | void
    ): number {
        return APIService.httpClient.interceptors.request.use(
            onFulfilled,
            onRejected
        )
    }

    public static addResponseInterceptor(
        onFulfilled?: (
            value: AxiosResponse
        ) => AxiosResponse | Promise<AxiosResponse>,
        onRejected?: (error: unknown) => Promise<never> | void
    ): number {
        return APIService.httpClient.interceptors.response.use(
            onFulfilled,
            onRejected
        )
    }

    public static async get<R = unknown>(
        url: string,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return APIService.httpClient.get<R>(url, { params, ...config })
    }

    public static async post<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return APIService.httpClient.post<R>(url, data, { params, ...config })
    }

    public static async put<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return APIService.httpClient.put<R>(url, data, { params, ...config })
    }

    public static async delete<R = unknown>(
        url: string,
        data?: object,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return APIService.httpClient.delete<R>(url, { data, params, ...config })
    }

    public static async uploadFile<R = unknown>(
        url: string,
        formData: FormData,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return APIService.httpClient.post<R>(url, formData, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        })
    }
}
