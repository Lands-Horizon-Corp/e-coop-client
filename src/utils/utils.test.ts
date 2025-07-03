import { describe, expect, it } from 'vitest'

import { formatNumber, toReadableDate } from './'

describe('toReadableDate', () => {
    it('Should be December 3 2024', () => {
        const currentDate = new Date(2024, 11, 3)
        expect(toReadableDate(currentDate)).toBe('December 3 2024')
    })

    it('Should be December 1 2024', () => {
        const currentDate = new Date(2024, 11, 1)
        expect(toReadableDate(currentDate)).toBe('December 1 2024')
    })

    it('Should be custom format 12/03/2024', () => {
        const currentDate = new Date(2024, 11, 3)
        expect(toReadableDate(currentDate, 'MM/dd/yyyy')).toBe('12/03/2024')
    })
})

describe('formatNumber', () => {
    it('10.243 should be 10.24', () => {
        expect(formatNumber(10.243)).toBe('10.24')
    })

    it('10.243 should be 10.2', () => {
        expect(formatNumber(10.243, 1, 1)).toBe('10.2')
    })

    it('10.243 should be 10', () => {
        expect(formatNumber(10.243, 0, 0)).toBe('10')
    })
})
