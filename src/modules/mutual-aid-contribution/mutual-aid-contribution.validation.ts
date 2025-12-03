import z from 'zod'

import { entityIdSchema } from '@/validation'

export const MutualAidContributionSchema = z.object({
    id: entityIdSchema.optional(),

    months_from: z.number().int().min(0),
    months_to: z.number().int().min(0),
    amount: z.number().min(0),
})

export type TMutualAidContributionSchema = z.infer<
    typeof MutualAidContributionSchema
>
