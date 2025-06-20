export const API_URL =
    import.meta.env.VITE_API_BASE_URL ??
    process.env.VITE_API_BASE_URL ??
    'http://localhost:8000/api/'

export const WS_URL =
    import.meta.env.VITE_WS_URL ??
    process.env.VITE_WS_URL ??
    'ws://localhost:8080'

export const APP_ENV = import.meta.env.VITE_APP_ENV
