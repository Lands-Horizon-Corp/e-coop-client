import axios, { AxiosInstance } from 'axios'

import { API_URL } from '@/constants'

let geoCache: Record<string, string> | null = {}
let geoPermissionRequested = false

const getDefaultUrl = (): string => {
    return API_URL?.endsWith('/') ? API_URL : `${API_URL}/`
}

export const httpClient: AxiosInstance = axios.create({
    baseURL: getDefaultUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export const getCsrfTokenFromCookies = (): string | null => {
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

export const getDeviceType = (): string => {
    const ua = navigator.userAgent
    if (/mobile/i.test(ua)) return 'Mobile'
    if (/tablet/i.test(ua)) return 'Tablet'
    if (/iPad|Android|Touch/.test(ua)) return 'Tablet'
    if (/Macintosh/i.test(ua) && 'ontouchend' in document) return 'Tablet'
    return 'Desktop'
}

export const getGeoHeaders = (): Record<string, string> => {
    const baseHeaders = {
        'X-Device-Type': getDeviceType(),
        Location: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    if (geoCache) {
        return { ...baseHeaders, ...geoCache }
    }

    return baseHeaders
}

export const requestGeolocation = (): Promise<void> => {
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
