// App Environment
export const APP_ENV =
    import.meta.env.VITE_APP_ENV || process.env.VITE_APP_ENV || 'development'

// API / BACKEND SERVER
export const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    'http://localhost:8000/api/'

// WS
export const WS_URL =
    import.meta.env.VITE_WS_URL ||
    process.env.VITE_WS_URL ||
    'ws://localhost:8080'

// NATS
export const NATS_CLIENT = import.meta.env.VITE_WS_CLIENT || ''

export const NATS_USER = import.meta.env.VITE_WS_USER || ''

export const NATS_PASS = import.meta.env.VITE_WS_PASSWORD || ''

// TURNSTILE CAPTCHA
export const TURNSTILE_CAPTCHA_SITE_KEY =
    import.meta.env.VITE_TURNSTILE_CAPTCHA_SITE_KEY ||
    process.env.VITE_TURNSTILE_CAPTCHA_SITE_KEY ||
    ''

// GOOGLE
export const GOOGLE_MAPS_API_KEY =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    ''
