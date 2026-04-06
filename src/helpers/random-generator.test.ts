import { describe, expect, it, vi } from 'vitest'

import { randomSyncGenerator } from './random-generator'

describe('randomSyncGenerator Suite', () => {
    it('should return a string', () => {
        const result = randomSyncGenerator()
        expect(typeof result).toBe('string')
    })

    it('should return a non-empty hash', () => {
        const result = randomSyncGenerator()
        expect(result.length).toBeGreaterThan(0)
    })

    it('should return a SHA-256 length (64 chars)', () => {
        const result = randomSyncGenerator()
        expect(result.length).toBe(64)
    })

    it('should return hex string only', () => {
        const result = randomSyncGenerator()
        expect(result).toMatch(/^[a-f0-9]+$/)
    })

    it('should generate unique values', () => {
        const a = randomSyncGenerator()
        const b = randomSyncGenerator()
        expect(a).not.toBe(b)
    })

    it('should include prefix influence (different prefix = different hash)', () => {
        const a = randomSyncGenerator('A')
        const b = randomSyncGenerator('B')
        expect(a).not.toBe(b)
    })

    it('should be deterministic for same input if mocked (advanced)', () => {
        const uuidSpy = vi
            .spyOn(globalThis.crypto, 'randomUUID')
            .mockReturnValue('123e4567-e89b-12d3-a456-426614174000')

        const RealDate = Date

        const dateSpy = vi
            .spyOn(global, 'Date')
            .mockImplementation(
                (...args: ConstructorParameters<typeof Date>) => {
                    if (args.length) {
                        return new RealDate(...args)
                    }
                    return new RealDate('2026-01-01T00:00:00Z')
                }
            )

        const a = randomSyncGenerator('TEST')
        const b = randomSyncGenerator('TEST')

        expect(a).toBe(b)

        uuidSpy.mockRestore()
        dateSpy.mockRestore()
    })
})
