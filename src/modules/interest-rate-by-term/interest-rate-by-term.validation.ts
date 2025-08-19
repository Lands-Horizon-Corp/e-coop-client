import z from 'zod'

import { entityIdSchema } from '@/validation'

export const interestRateByTermSchema = z.object({
    name: z.string().optional(),
    descrition: z.string().optional(),
    member_classification_interest_rate_id: entityIdSchema.optional(),
})
export type TInterestRateByTermFormValues = z.infer<
    typeof interestRateByTermSchema
>
