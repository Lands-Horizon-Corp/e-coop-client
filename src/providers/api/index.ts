import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

import { API_URL } from '@/constants/envs'

export interface IRequestParams {
    [key: string]: unknown
}

const getDefaultUrl = (): string => {
    return API_URL?.endsWith('/') ? API_URL : `${API_URL}/`
}

const getCsrfTokenFromCookies = (): string | null => {
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

const getDeviceType = (): string => {
    const ua = navigator.userAgent
    if (/mobile/i.test(ua)) return 'Mobile'
    if (/tablet/i.test(ua)) return 'Tablet'
    if (/iPad|Android|Touch/.test(ua)) return 'Tablet'
    if (/Macintosh/i.test(ua) && 'ontouchend' in document) return 'Tablet'
    return 'Desktop'
}

// Cache for geolocation data to avoid repeated requests
let geoCache: Record<string, string> | null = null
let geoPermissionRequested = false

const getGeoHeaders = (): Record<string, string> => {
    const baseHeaders = {
        'X-Device-Type': getDeviceType(),
        Location: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    if (geoCache) {
        return { ...baseHeaders, ...geoCache }
    }

    return baseHeaders
}

const requestGeolocation = (): Promise<void> => {
    return new Promise((resolve) => {
        if (
            typeof window === 'undefined' ||
            !navigator.geolocation ||
            geoPermissionRequested
        ) {
            resolve()
            return
        }

        geoPermissionRequested = true
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const longitude = pos.coords.longitude.toString()
                const latitude = pos.coords.latitude.toString()
                geoCache = {
                    'X-Longitude': longitude,
                    'X-Latitude': latitude,
                }
                resolve()
            },
            () => {
                resolve()
            },
            {
                timeout: 5000,
                maximumAge: 300000, // 5 minutes
                enableHighAccuracy: false,
            }
        )
    })
}

const httpClient: AxiosInstance = axios.create({
    baseURL: getDefaultUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

httpClient.interceptors.request.use(async (config) => {
    const csrfToken = getCsrfTokenFromCookies()
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken
    }
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        config.headers['X-User-Agent'] = navigator.userAgent
    }

    const geoHeaders = getGeoHeaders()
    if (config.headers && typeof config.headers.set === 'function') {
        Object.entries(geoHeaders).forEach(([key, value]) => {
            config.headers.set(key, value)
        })
    } else {
        Object.assign(config.headers, geoHeaders)
    }
    return config
})

const API = {
    getHttpClient: (): AxiosInstance => httpClient,

    // Request geolocation permission and cache the result
    // Call this in response to user interaction (e.g., button click)
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
}

export default API

/*
import { API_URL } from '@/constants/envs';

export interface IRequestParams {
    [key: string]: unknown;
}

export default class API {
    private static httpClient: AxiosInstance = axios.create({
        baseURL: API.getDefaultUrl(),
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true, // Send cookies like the CSRF cookie
    });

    private static getDefaultUrl(): string {
        return API_URL?.endsWith('/') ? API_URL : `${API_URL}/`;
    }

    public static getHttpClient(): AxiosInstance {
        return API.httpClient;
    }

    // Add request interceptor to inject CSRF token
    static {
        API.httpClient.interceptors.request.use(async (config) => {
            const csrfToken = API.getCsrfTokenFromCookies();
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
            if (typeof navigator !== 'undefined' && navigator.userAgent) {
                config.headers['X-User-Agent'] = navigator.userAgent;
            }
            function getDeviceType(): string {
                const ua = navigator.userAgent;
                if (/mobile/i.test(ua)) return 'Mobile';
                if (/tablet/i.test(ua)) return 'Tablet';
                if (/iPad|Android|Touch/.test(ua)) return 'Tablet';
                if (/Macintosh/i.test(ua) && 'ontouchend' in document)
                    return 'Tablet';
                return 'Desktop';
            }

            const getGeoHeaders = (): Promise<Record<string, string>> => {
                return new Promise((resolve) => {
                    if (
                        typeof window === 'undefined' ||
                        !navigator.geolocation
                    ) {
                        resolve({});
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const longitude = pos.coords.longitude.toString();
                            const latitude = pos.coords.latitude.toString();
                            const location =
                                Intl.DateTimeFormat().resolvedOptions()
                                    .timeZone;
                            resolve({
                                'X-Longitude': longitude,
                                'X-Latitude': latitude,
                                Location: location,
                                'X-Device-Type': getDeviceType(),
                            });
                        },
                        () => resolve({}),
                        {
                            timeout: 5000,
                            maximumAge: 300000, // 5 minutes
                            enableHighAccuracy: false,
                        }
                    );
                });
            };

            const geoHeaders = await getGeoHeaders();
            if (config.headers && typeof config.headers.set === 'function') {
                Object.entries(geoHeaders).forEach(([key, value]) => {
                    config.headers.set(key, value);
                });
            } else {
                Object.assign(config.headers, geoHeaders);
            }
            return config;
        });
    }

    private static getCsrfTokenFromCookies(): string | null {
        const name = 'csrf=';
        const decodedCookies = decodeURIComponent(document.cookie);
        const cookies = decodedCookies.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name)) {
                return cookie.substring(name.length);
            }
        }
        return null;
    }

    public static addRequestInterceptor(
        onFulfilled?: (
            value: InternalAxiosRequestConfig,
        ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
        onRejected?: (error: unknown) => Promise<never> | void,
    ): number {
        return API.httpClient.interceptors.request.use(onFulfilled, onRejected);
    }

    public static addResponseInterceptor(
        onFulfilled?: (
            value: AxiosResponse,
        ) => AxiosResponse | Promise<AxiosResponse>,
        onRejected?: (error: unknown) => Promise<never> | void,
    ): number {
        return API.httpClient.interceptors.response.use(
            onFulfilled,
            onRejected,
        );
    }

    public static async get<R = unknown>(
        url: string,
        params?: IRequestParams,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<R>> {
        return API.httpClient.get<R>(url, { params, ...config });
    }

    public static async post<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<R>> {
        return API.httpClient.post<R>(url, data, { params, ...config });
    }

    public static async patch<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<R>> {
        return API.httpClient.patch<R>(url, data, { params, ...config });
    }

    public static async put<D = unknown, R = unknown>(
        url: string,
        data?: D,
        params?: IRequestParams,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<R>> {
        return API.httpClient.put<R>(url, data, { params, ...config });
    }

    public static async delete<R = unknown>(
        url: string,
        data?: object,
        params?: IRequestParams,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<R>> {
        return API.httpClient.delete<R>(url, { data, params, ...config });
    }

    public static async uploadFile<R = unknown>(
        url: string,
        formData: FormData,
        params?: IRequestParams,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<R>> {
        return API.httpClient.post<R>(url, formData, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        });
    }
}
*/
