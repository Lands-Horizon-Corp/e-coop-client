import z from 'zod'

import { entityIdSchema } from '../common'

export const cashCountSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.optional(),
    employee_user_id: entityIdSchema.optional(),

    country_code: z.string().min(2, 'Invalid country'),
    name: z.string().min(1, 'name required'),
    bill_amount: z.coerce.number(),
    quantity: z.coerce.number(),
    amount: z.coerce.number(),
})

export const cashCountBatchSchema = z.object({
    cash_counts: z.array(cashCountSchema),
    deleted_cash_counts: z.array(z.string().uuid()).optional(),
    deposit_in_bank: z.coerce.number().optional(),
    cash_count_total: z.coerce.number().optional(),
    grand_total: z.coerce.number().optional(),
})
