import { getTimeDifference } from './utils'
import { describe, it, expect } from 'vitest'

describe('getTimeDifference', () => {
    it('should return time in minutes if less than 60 minutes', () => {
        const date = new Date()
        const currentDate = new Date(date.getTime() + 45 * 60000) // 45 minutes later
        expect(getTimeDifference(date, currentDate)).toBe('45min')
    })

    it('should return time in hours if 60 minutes or more', () => {
        const date = new Date()
        const currentDate = new Date(date.getTime() + 120 * 60000) // 2 hours later
        expect(getTimeDifference(date, currentDate)).toBe('2h')
    })

    it('should return exactly 1 hour for 60 minutes', () => {
        const date = new Date()
        const currentDate = new Date(date.getTime() + 60 * 60000) // 1 hour later
        expect(getTimeDifference(date, currentDate)).toBe('1h')
    })
})
