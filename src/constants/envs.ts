// App Environment
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0'

// API / BACKEND SERVER
export const API_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// WS
export const SOKETI_KEY = import.meta.env.VITE_SOKETI_KEY
export const SOKETI_HOST = import.meta.env.VITE_SOKETI_HOST || 'localhost'
export const SOKETI_PORT = import.meta.env.VITE_SOKETI_PORT || 6001
export const SOKETI_CLIENT = import.meta.env.VITE_SOKETI_CLIENT

// TURNSTILE CAPTCHA
export const TURNSTILE_CAPTCHA_SITE_KEY =
    import.meta.env.VITE_TURNSTILE_CAPTCHA_SITE_KEY || ''

// GOOGLE
export const GOOGLE_MAPS_API_KEY =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID || ''

export const IS_STAGING = !['development', 'local'].includes(APP_ENV)
