/// <reference types="react-scripts" />

declare module '*.css'
declare global {
    interface Window {
        // Add any global window properties here
        gtag?: (...args: unknown[]) => void
        dataLayer?: Record<string, unknown>[]
    }

    // Global utility types
    type Nullable<T> = T | null
    type Optional<T> = T | undefined
    type Maybe<T> = T | null | undefined
    type DeepPartial<T> = {
        [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
    }
}
