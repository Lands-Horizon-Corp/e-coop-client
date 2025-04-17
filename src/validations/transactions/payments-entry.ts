import { sanitizeNumberInput } from '@/helpers'
import { z } from 'zod'

export const DEFAULT_TRANSACTION_TYPE = 'trans-pay-001'

export const paymentsEntrySchema = z.object({
    amount: z.preprocess(
        (val) => {
            if (typeof val === 'string') {
                const sanitized = sanitizeNumberInput(val)

                if ((sanitized.match(/\./g)?.length ?? 0) > 1) {
                    return undefined
                }
                const parsed = parseFloat(sanitized)
                return sanitized === '' || isNaN(parsed) || parsed === 0
                    ? undefined
                    : parsed
            }

            return typeof val === 'number' && !isNaN(val) && val !== 0
                ? val
                : undefined
        },
        z.number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
        })
    ),
    accountsId: z.string().min(1, 'Accounts is required'),
    isPrinted: z.boolean().optional(),
    notes: z.string().optional(),
    paymentType: z.string().default(DEFAULT_TRANSACTION_TYPE),
    transactionType: z.string().min(1, 'transactionType is Required'),
})
