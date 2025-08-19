import z from 'zod'

import { entityIdSchema } from '@/validation'

export const interestRatePercentageSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    months: z.number().optional(),
    interest_rate: z.number().optional(),
    member_classification_interest_rate_id: entityIdSchema.optional(),
})
export type TInterestRatePercentageFormValues = z.infer<
    typeof interestRatePercentageSchema
>
