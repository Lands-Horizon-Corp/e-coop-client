// idempotency.ts

export type IdempotencyOptions = {
    type?: 'uuid' | 'entropy'
    prefix?: string
    length?: number // for entropy keys (default: 32)
}

/**
 * Generate a valid idempotency key compatible with your Go validator
 */
export const generateIdempotencyKey = (
    options: IdempotencyOptions = {}
): string => {
    const { type = 'uuid', prefix, length = 32 } = options

    const key =
        type === 'uuid' ? generateUUID() : generateHighEntropyKey(length)

    return prefix ? `${prefix}:${key}` : key
}

/**
 * Generate UUID (v4)
 */
export const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }

    // fallback for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

/**
 * Generate high-entropy key (passes your Go validation)
 */
export const generateHighEntropyKey = (length: number): string => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'

    let result = ''

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint8Array(length)
        crypto.getRandomValues(array)

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length]
        }
    } else {
        // fallback
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)]
        }
    }

    return result
}
