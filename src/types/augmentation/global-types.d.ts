/// <reference types="vite/client" />

// CSS Modules
declare module '*.css'

// Global types
declare global {
    interface Window {
        // Add any global window properties here
        gtag?: (...args: unknown[]) => void
        dataLayer?: Record<string, unknown>[]
        turnstile?: {
            render: (
                element: string | HTMLElement,
                options: {
                    sitekey: string
                    callback?: (token: string) => void
                    'error-callback'?: (error: Error) => void
                    theme?: 'light' | 'dark' | 'auto'
                    size?: 'normal' | 'compact'
                }
            ) => string
            remove: (widgetId: string) => void
            reset: (widgetId?: string) => void
        }
    }
}

export {}
