import { describe, expect, it } from 'vitest'

import { buildCashCheckOR } from './cash-check-voucher.utils'

describe('buildCashCheckOR', () => {
    const baseSettings = {
        check_voucher_general: true,
        check_voucher_general_allow_user_input: false,
        check_voucher_general_or_unique: true,
        check_voucher_general_prefix: 'GEN-',
        check_voucher_general_or_start: 1,
        check_voucher_general_or_current: 12,
        check_voucher_general_or_iteration: 1,
        check_voucher_general_padding: 5,

        cash_check_voucher_allow_user_input: false,
        cash_check_voucher_or_unique: true,
        cash_check_voucher_prefix: 'CASH-',
        cash_check_voucher_or_start: 100,
        cash_check_voucher_or_current: 345,
        cash_check_voucher_or_iteration: 1,
        cash_check_voucher_padding: 4,
    }

    it('uses GENERAL voucher config when check_voucher_general = true', () => {
        const result = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: true,
        })

        // current = 12, padding = 5 → 00012
        expect(result).toBe('GEN-00012')
    })

    it('uses CASH CHECK voucher config when check_voucher_general = false', () => {
        const result = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: false,
        })

        // current = 345, padding = 4 → 0345
        expect(result).toBe('CASH-0345')
    })

    it('respects different prefixes for general vs cash check', () => {
        const general = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: true,
            check_voucher_general_prefix: 'GV-',
        })

        const cash = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: false,
            cash_check_voucher_prefix: 'CV-',
        })

        expect(general.startsWith('GV-')).toBe(true)
        expect(cash.startsWith('CV-')).toBe(true)
    })

    it('respects different padding values', () => {
        const general = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: true,
            check_voucher_general_or_current: 7,
            check_voucher_general_padding: 3,
        })

        const cash = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: false,
            cash_check_voucher_or_current: 7,
            cash_check_voucher_padding: 6,
        })

        expect(general).toBe('GEN-007')
        expect(cash).toBe('CASH-000007')
    })

    it('does not mix GENERAL and CASH configs', () => {
        const result = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: false,
            // these SHOULD be ignored
            check_voucher_general_prefix: 'SHOULD-NOT-USE',
            check_voucher_general_padding: 10,
        })

        expect(result).toBe('CASH-0345')
        expect(result.includes('SHOULD-NOT-USE')).toBe(false)
    })

    it('handles zero OR values correctly', () => {
        const result = buildCashCheckOR({
            ...baseSettings,
            check_voucher_general: true,
            check_voucher_general_or_current: 0,
            check_voucher_general_padding: 4,
        })

        expect(result).toBe('GEN-0000')
    })
})
