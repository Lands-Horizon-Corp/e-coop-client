import z from 'zod'

import { entityIdSchema } from '@/validation'

export const MutualFundAdditionalMembersSchema = z.object({
    id: entityIdSchema.optional(),

    mutual_fund_id: entityIdSchema.optional(),
    mutual_fund: z.any().optional(),

    member_type_id: entityIdSchema,
    member_type: z.any().optional(),

    number_of_members: z.number().int().min(1),
    ratio: z.number().min(0).max(100),
})

export type TMutualFundAdditionalMembersSchema = z.infer<
    typeof MutualFundAdditionalMembersSchema
>
