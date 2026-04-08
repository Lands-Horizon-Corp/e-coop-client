import { describe, expect, it, vi } from 'vitest'

import { generateUUID } from './idempotency-utils'

describe('generateUUID Suite', () => {
    it('should return a string', () => {
        const result = generateUUID()
        expect(typeof result).toBe('string')
    })

    it('should return a non-empty string', () => {
        const result = generateUUID()
        expect(result.length).toBeGreaterThan(0)
    })

    it('should return a valid UUID v4 format', () => {
        const result = generateUUID()

        // UUID v4 regex
        const uuidV4Regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

        expect(result).toMatch(uuidV4Regex)
    })

    it('should generate unique values', () => {
        const a = generateUUID()
        const b = generateUUID()

        expect(a).not.toBe(b)
    })

    it('should fallback when crypto.randomUUID is not available', () => {
        const originalCrypto = globalThis.crypto

        vi.stubGlobal('crypto', undefined)

        const result = generateUUID()

        expect(result).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        )

        vi.stubGlobal('crypto', originalCrypto)
    })

    it('should fallback when crypto.randomUUID is not available', () => {
        const originalCrypto = globalThis.crypto

        // @ts-expect-error override for test
        globalThis.crypto = undefined

        const result = generateUUID()

        expect(result).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        )

        globalThis.crypto = originalCrypto
    })
})
