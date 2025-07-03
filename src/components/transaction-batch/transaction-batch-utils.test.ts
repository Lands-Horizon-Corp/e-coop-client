import { describe, expect, it } from 'vitest'

import {
    TTransactionBatchData,
    getTransactionStatus,
} from './transaction-batch-utils'

describe('getTransactionStatus', () => {
    it('returns BALANCED when actual equals supposed', () => {
        const data: TTransactionBatchData = {
            total_actual_remittance: 1000,
            total_supposed_remitance: 1000,
        }

        const result = getTransactionStatus(data)
        expect(result).toBe('BALANCED')
    })

    it('returns OVERAGE when actual is greater than supposed', () => {
        const data: TTransactionBatchData = {
            total_actual_remittance: 1500,
            total_supposed_remitance: 1000,
        }

        const result = getTransactionStatus(data)
        expect(result).toBe('OVERAGE')
    })

    it('returns SHORTAGE when actual is less than supposed', () => {
        const data: TTransactionBatchData = {
            total_actual_remittance: 800,
            total_supposed_remitance: 1000,
        }

        const result = getTransactionStatus(data)
        expect(result).toBe('SHORTAGE')
    })
})
