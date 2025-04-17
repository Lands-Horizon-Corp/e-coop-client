import { z } from 'zod'
import { amountPreprocess } from '../transactions/common'

export const TCheckClearingSchema = z.object({
    checkNo: z.string().min(1, 'Check no. is required'),
    bankId: z.string().min(1, 'Bank is required'),
    checkDate: z.preprocess(
        (val) => {
            if (!val) return undefined
            return typeof val === 'string' || val instanceof Date
                ? new Date(val)
                : undefined
        },
        z.date({ required_error: 'Check date is required' })
    ),
    picture: z.string().optional(),
    amount: amountPreprocess,
})
