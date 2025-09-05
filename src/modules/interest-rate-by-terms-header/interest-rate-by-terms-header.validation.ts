import z from 'zod'

import { entityIdSchema } from '@/validation'

export const interestRateByTermsHeaderSchema = z.object({
    member_classification_interest_rate_id: entityIdSchema,
    header_1: z.number().optional(),
    header_2: z.number().optional(),
    header_3: z.number().optional(),
    header_4: z.number().optional(),
    header_5: z.number().optional(),
    header_6: z.number().optional(),
    header_7: z.number().optional(),
    header_8: z.number().optional(),
    header_9: z.number().optional(),
    header_10: z.number().optional(),
    header_11: z.number().optional(),
    header_12: z.number().optional(),
    header_13: z.number().optional(),
    header_14: z.number().optional(),
    header_15: z.number().optional(),
    header_16: z.number().optional(),
    header_17: z.number().optional(),
    header_18: z.number().optional(),
    header_19: z.number().optional(),
    header_20: z.number().optional(),
    header_21: z.number().optional(),
    header_22: z.number().optional(),
})
export type TInterestRateByTermsHeaderFormValues = z.infer<
    typeof interestRateByTermsHeaderSchema
>
