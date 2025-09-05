import z from 'zod'

import { entityIdSchema } from '@/validation'

export const generalLedgerSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    account_id: entityIdSchema.optional().nullable(),
    transaction_id: entityIdSchema.optional().nullable(),
    transaction_batch_id: entityIdSchema.optional().nullable(),
    employee_user_id: entityIdSchema.optional().nullable(),
    member_profile_id: entityIdSchema.optional().nullable(),
    member_joint_account_id: entityIdSchema.optional().nullable(),
    transaction_reference_number: z.string().optional(),
    reference_number: z.string().optional(),
    payment_type_id: entityIdSchema.optional().nullable(),
    source: z.string().optional(),
    journal_voucher_id: entityIdSchema.optional().nullable(),
    adjustment_entry_id: entityIdSchema.optional().nullable(),
    type_of_payment_type: z.string().optional(),
    credit: z.number().optional(),
    debit: z.number().optional(),
    balance: z.number().optional(),
})
export type TGeneralLedgerRequest = z.infer<typeof generalLedgerSchema>
