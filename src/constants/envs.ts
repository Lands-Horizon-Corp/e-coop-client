import { getEnv } from '@/helpers/sanitizer'

// App Environment
export const APP_ENV = getEnv('VITE_APP_ENV', 'development')
export const APP_VERSION = getEnv('VITE_APP_VERSION', '0.0.0')

// API / BACKEND SERVER
export const API_URL = getEnv('VITE_API_BASE_URL', 'http://localhost:8000')

// WS (Soketi)
export const SOKETI_KEY = getEnv(
    'VITE_SOKETI_KEY',
    '8KxrqyQiVuoIbVryU8tTPcoJW9RtAVI8Khqrb5rv3Wb8eW8foXGmxwC0jbgEJvGd'
)
export const SOKETI_HOST = getEnv('VITE_SOKETI_HOST', '127.0.0.1')

// We use getEnv to get the string, then parse it to a number
const rawPort = getEnv('VITE_SOKETI_PORT', '6001')
export const SOKETI_PORT = parseInt(rawPort, 10)

// TURNSTILE CAPTCHA
export const TURNSTILE_CAPTCHA_SITE_KEY = getEnv(
    'VITE_TURNSTILE_CAPTCHA_SITE_KEY',
    ''
)

// GOOGLE
export const GOOGLE_MAPS_API_KEY = getEnv('VITE_GOOGLE_MAPS_API_KEY', '')
export const GOOGLE_MAPS_MAP_ID = getEnv('VITE_GOOGLE_MAPS_ID', '')

// Computed Logic
export const IS_STAGING = !['development', 'local'].includes(APP_ENV)
