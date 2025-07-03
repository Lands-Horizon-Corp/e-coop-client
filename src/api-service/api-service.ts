import { API_URL } from '@/constants/envs'
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'

import { IRequestParams } from '@/types'

export default class APIService {
    private static httpClient: AxiosInstance = axios.create({
        baseURL: APIService.getDefaultUrl(),
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true, // Send cookies like the CSRF cookie
    })

    private static getDefaultUrl(): string {
        return API_URL?.endsWith('/') ? API_URL : `${API_URL}/`
    }

    public static getHttpClient(): AxiosInstance {
        return APIService.httpClient
    }

    // Add request interceptor to inject CSRF token
    static {
        APIService.httpClient.interceptors.request.use(async (config) => {
            const csrfToken = APIService.getCsrfTokenFromCookies()
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken
            }
            if (typeof navigator !== 'undefined' && navigator.userAgent) {
                config.headers['X-User-Agent'] = navigator.userAgent
            }
            function getDeviceType(): string {
                const ua = navigator.userAgent
                if (/mobile/i.test(ua)) return 'Mobile'
                if (/tablet/i.test(ua)) return 'Tablet'
                if (/iPad|Android|Touch/.test(ua)) return 'Tablet'
                if (/Macintosh/i.test(ua) && 'ontouchend' in document)
                    return 'Tablet'
                return 'Desktop'
            }

            const getGeoHeaders = (): Promise<Record<string, string>> => {
                return new Promise((resolve) => {
                    if (
                        typeof window === 'undefined' ||
                        !navigator.geolocation
                    ) {
                        resolve({})
                        return
                    }
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const longitude = pos.coords.longitude.toString()
                            const latitude = pos.coords.latitude.toString()
                            const location =
                                Intl.DateTimeFormat().resolvedOptions().timeZone
                            resolve({
                                'X-Longitude': longitude,
                                'X-Latitude': latitude,
                                Location: location,
                                'X-Device-Type': getDeviceType(),
                            })
                        },
                        () => resolve({})
                    )
                })
            }

            const geoHeaders = await getGeoHeaders()
            if (config.headers && typeof config.headers.set === 'function') {
                Object.entries(geoHeaders).forEach(([key, value]) => {
                    config.headers.set(key, value)
                })
            } else {
                Object.assign(config.headers, geoHeaders)
            }
            return config
        })
    }

    // export const signIn = async (data: ISignInRequest) => {
    //     const endpoint = `/authentication/login`

    //     const geoHeaders = await getGeoHeaders();
    //     return (
    //         await APIService.post<ISignInRequest, IAuthContext>(
    //             endpoint,
    //             data,
    //             undefined,
    //             { headers: {
    //                 ...geoHeaders,
    //                 withCredentials: true,
    //         } }
    //         )
    //     ).data;
    // };

    // Extract the CSRF token from cookies
    private static getCsrfTokenFromCookies(): string | null {
        const name = 'csrf='
        const decodedCookies = decodeURIComponent(document.cookie)
        const cookies = decodedCookies.split(';')
        for (let cookie of cookies) {
            cookie = cookie.trim()
            if (cookie.startsWith(name)) {
                return cookie.substring(name.length)
            }
        }
        return null
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

    public static async patch<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<R>> {
        return APIService.httpClient.patch<R>(url, data, { params, ...config })
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
