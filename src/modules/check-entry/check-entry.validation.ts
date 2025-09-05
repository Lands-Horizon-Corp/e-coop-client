import z from 'zod'

import { entityIdSchema } from '@/validation'

export const checkEntrySchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    account_id: entityIdSchema.optional().nullable(),
    media_id: entityIdSchema.optional().nullable(),
    bank_id: entityIdSchema.optional().nullable(),
    member_profile_id: entityIdSchema.optional().nullable(),
    member_joint_account_id: entityIdSchema.optional().nullable(),
    employee_user_id: entityIdSchema.optional().nullable(),
    transaction_id: entityIdSchema.optional().nullable(),
    transaction_batch_id: entityIdSchema.optional().nullable(),
    general_ledger_id: entityIdSchema.optional().nullable(),
    disbursement_transaction_id: entityIdSchema.optional().nullable(),
    credit: z.number().optional(),
    debit: z.number().optional(),
    check_number: z.string().min(1).max(255),
    check_date: z.string().optional().nullable(),
})

export type TCheckEntryFormValues = z.infer<typeof checkEntrySchema>
