import z from 'zod'

import { descriptionSchema, entityIdSchema } from '@/validation'

export const generalAccountGroupingNetSurplusNegativeSchema = z.object({
    name: z.string().min(1).max(255),
    description: descriptionSchema.optional(),
    account_id: entityIdSchema,
    percentage_1: z.number().optional(),
    percentage_2: z.number().optional(),
})
export type TGeneralAccountGroupingNetSurplusNegativeFormValues = z.infer<
    typeof generalAccountGroupingNetSurplusNegativeSchema
>
