import z from 'zod'

import { entityIdSchema } from '@/validation'

export const disbursementTransactiontSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    disbursement_id: entityIdSchema,
    transaction_batch_id: entityIdSchema,
    employee_user_id: entityIdSchema,
    transaction_reference_number: z.string().optional(),
    reference_number: z.string().optional(),
    amount: z.number().optional(),
})
export type TDisbursementTransaction = z.infer<
    typeof disbursementTransactiontSchema
>
