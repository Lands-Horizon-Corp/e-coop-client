import { describe, expect, it } from 'vitest'

import { TORLoanVoucherSettings } from './loan-transaction.types'
import { buildLoanVoucherOR } from './loan-transaction.utils'

describe('buildLoanVoucherOR', () => {
    const baseSettings: TORLoanVoucherSettings = {
        /** General */
        check_voucher_general: true,
        check_voucher_general_allow_user_input: false,
        check_voucher_general_prefix: 'GEN-',
        check_voucher_general_or_start: 1,
        check_voucher_general_or_current: 12,
        check_voucher_general_or_iteration: 1,
        check_voucher_general_padding: 5,

        /** Loan */
        loan_voucher_allow_user_input: false,
        loan_voucher_prefix: 'LOAN-',
        loan_voucher_or_start: 100,
        loan_voucher_or_current: 345,
        loan_voucher_or_iteration: 1,
        loan_voucher_padding: 4,
        loan_applied_equal_to_balance: false,
    }

    it('uses GENERAL voucher config when check_voucher_general = true', () => {
        const result = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: true,
        })

        // current = 12, padding = 5 → 00012
        expect(result).toBe('GEN-00012')
    })

    it('uses LOAN voucher config when check_voucher_general = false', () => {
        const result = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: false,
        })

        // current = 345, padding = 4 → 0345
        expect(result).toBe('LOAN-0345')
    })

    it('respects different prefixes for general vs loan', () => {
        const general = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: true,
            check_voucher_general_prefix: 'GV-',
        })

        const loan = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: false,
            loan_voucher_prefix: 'LV-',
        })

        expect(general.startsWith('GV-')).toBe(true)
        expect(loan.startsWith('LV-')).toBe(true)
    })

    it('respects different padding values', () => {
        const general = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: true,
            check_voucher_general_or_current: 7,
            check_voucher_general_padding: 3,
        })

        const loan = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: false,
            loan_voucher_or_current: 7,
            loan_voucher_padding: 6,
        })

        expect(general).toBe('GEN-007')
        expect(loan).toBe('LOAN-000007')
    })

    it('does not mix GENERAL and LOAN configs', () => {
        const result = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: false,
            // these SHOULD be ignored
            check_voucher_general_prefix: 'SHOULD-NOT-USE',
            check_voucher_general_padding: 10,
        })

        expect(result).toBe('LOAN-0345')
        expect(result.includes('SHOULD-NOT-USE')).toBe(false)
    })

    it('handles zero OR values correctly', () => {
        const result = buildLoanVoucherOR({
            ...baseSettings,
            check_voucher_general: true,
            check_voucher_general_or_current: 0,
            check_voucher_general_padding: 4,
        })

        expect(result).toBe('GEN-0000')
    })
})
