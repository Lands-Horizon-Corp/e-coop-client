export const APP_ENV = import.meta.env.APP_ENV || process.env.APP_ENV;

// API/BACKEND SERVER
export const API_URL =
    import.meta.env.API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:8000/api/';

// WS
export const WS_URL =
    import.meta.env.WS_URL || process.env.WS_URL || 'ws://localhost:8080';

export const NATS_CLIENT = import.meta.env.WS_CLIENT || process.env.WS_CLIENT;
export const NATS_USER = import.meta.env.WS_USER || process.env.WS_USER;
export const NATS_PASS = import.meta.env.WS_PASSWORD || process.env.WS_PASSWORD;
