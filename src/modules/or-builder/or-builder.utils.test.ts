import { describe, expect, it } from 'vitest'

import { buildOR } from './or-builder.utils'

describe('BuildOR Suite', () => {
    it('OR : 1 -> 1', () => {
        expect(buildOR({ currentOr: 1 })).toBe('1')
    })

    it('OR pad start of 4 zeros : 1 -> 0001', () => {
        expect(buildOR({ currentOr: 1, padding: 4 })).toBe('0001')
    })

    it('OR pad start with custom pad char (X): 1 -> XXX1', () => {
        expect(buildOR({ currentOr: 1, padding: 4, paddingChar: 'X' })).toBe(
            'XXX1'
        )
    })

    it("OR Prefix 'REF' : 1 -> REF1", () => {
        expect(buildOR({ currentOr: 1, prefix: 'REF' })).toBe('REF1')
    })

    it("OR Prefix + padding : 'REF' + 0001 -> REF0001", () => {
        expect(buildOR({ currentOr: 1, prefix: 'REF', padding: 4 })).toBe(
            'REF0001'
        )
    })

    it('OR large number without padding remains unchanged', () => {
        expect(buildOR({ currentOr: 123456 })).toBe('123456')
    })

    it('OR padding smaller than number length does not truncate', () => {
        expect(buildOR({ currentOr: 12345, padding: 3 })).toBe('12345')
    })

    it('OR padding equals number length returns same value', () => {
        expect(buildOR({ currentOr: 1234, padding: 4 })).toBe('1234')
    })

    it('OR paddingChar ignored when padding is undefined', () => {
        expect(buildOR({ currentOr: 1, paddingChar: 'X' })).toBe('1')
    })

    it('OR empty prefix behaves same as no prefix', () => {
        expect(buildOR({ currentOr: 9, prefix: '' })).toBe('9')
    })

    it('OR prefix with special characters', () => {
        expect(buildOR({ currentOr: 7, prefix: 'OR-' })).toBe('OR-7')
    })

    it('OR zero value', () => {
        expect(buildOR({ currentOr: 0 })).toBe('0')
    })

    it('OR zero value with padding', () => {
        expect(buildOR({ currentOr: 0, padding: 4 })).toBe('0000')
    })
})
