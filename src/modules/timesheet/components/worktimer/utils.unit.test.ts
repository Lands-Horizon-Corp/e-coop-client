import { describe, expect, it } from 'vitest'

import { getTimeDifference } from './utils'

describe('getTimeDifference', () => {
    it('minutes should be 45', () => {
        const date = new Date()
        const currentDate = new Date(date.getTime() + 45 * 60000) // 45 minutes later
        expect(getTimeDifference(date, currentDate).minutes).toBe(45)
    })

    it('hour should be 2', () => {
        const date = new Date()
        const currentDate = new Date(date.getTime() + 120 * 60000) // 2 hours later
        expect(getTimeDifference(date, currentDate).hours).toBe(2)
    })

    it('should be 1 hour', () => {
        const date = new Date()
        const currentDate = new Date(date.getTime() + 60 * 60000) // 1 hour later
        expect(getTimeDifference(date, currentDate).hours).toBe(1)
    })
})
