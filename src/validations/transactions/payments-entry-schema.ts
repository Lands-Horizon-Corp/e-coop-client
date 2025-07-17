import { z } from 'zod'

import { amountPreprocess } from './common'

export const DEFAULT_TRANSACTION_TYPE = 'trans-pay-001'

export const paymentsEntrySchema = z.object({
    ORNumber: z.string().min(1, 'OR Number is required'),
    amount: amountPreprocess,
    accountsId: z.string().min(1, 'Accounts is required'),
    isPrinted: z.boolean().optional(),
    notes: z.string().optional(),
    transactionType: z.string().default(DEFAULT_TRANSACTION_TYPE),
    defaultAccounting: z
        .enum(['loan', 'savings', 'withdraw', 'none', 'time'])
        .default('none'),
})
