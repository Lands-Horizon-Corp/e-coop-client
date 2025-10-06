import { z } from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

import { PaymentWithTransactionSchema } from '../transaction'

export const QuickWithdrawSchema = PaymentWithTransactionSchema.extend({
    member_profile_id: EntityIdSchema('Member').min(1),
    member_joint_account_id: entityIdSchema.optional(),
    reference_number: z
        .string({ error: 'Reference number is required' })
        .min(1),
    or_auto_generated: z.boolean().default(false).optional(),

    member_joint_account: z.any().optional(),
})

export type TQuickWithdrawSchemaFormValues = z.infer<typeof QuickWithdrawSchema>
