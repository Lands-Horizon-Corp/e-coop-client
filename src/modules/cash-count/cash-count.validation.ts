import z from 'zod'

import { entityIdSchema } from '@/validation'

export const CashCountSchema = z.object({
    id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),
    branch_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.optional(),
    employee_user_id: entityIdSchema.optional(),

    currency_id: entityIdSchema,
    currency: z.any(),

    name: z.string().min(1, 'name required'),
    bill_amount: z.coerce.number(),
    quantity: z.coerce.number(),
    amount: z.coerce.number(),
})

export const CashCountBatchSchema = z.object({
    cash_counts: z.array(CashCountSchema),
    deleted_cash_counts: z.array(z.uuid()).optional(),
    deposit_in_bank: z.coerce.number().optional(),
    cash_count_total: z.coerce.number().optional(),
    grand_total: z.coerce.number().optional(),
})

export type CashCountFormValues = z.infer<typeof CashCountSchema>
export type CashCountBatchFormValues = z.infer<typeof CashCountBatchSchema>
