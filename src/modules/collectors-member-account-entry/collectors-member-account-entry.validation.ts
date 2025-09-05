import z from 'zod'

import { descriptionSchema, entityIdSchema } from '@/validation'

export const collectorsMemberAccountEntrySchema = z.object({
    collector_user_id: entityIdSchema.optional().nullable(),
    member_profile_id: entityIdSchema.optional().nullable(),
    account_id: entityIdSchema.optional().nullable(),
    description: descriptionSchema.optional(),
})
export type ICollectorsMemberAccountEntryFormValues = z.infer<
    typeof collectorsMemberAccountEntrySchema
>
