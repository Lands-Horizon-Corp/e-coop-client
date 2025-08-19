import z from 'zod'

import { entityIdSchema } from '@/validation'

export const ChargesRateByTermSchema = z.object({
    charges_rate_scheme_id: entityIdSchema,
    name: z.string().max(255).optional(),
    description: z.string().optional(),
    mode_of_payment: z.string().max(20).optional(),

    rate_1: z.number().optional(),
    rate_2: z.number().optional(),
    rate_3: z.number().optional(),
    rate_4: z.number().optional(),
    rate_5: z.number().optional(),
    rate_6: z.number().optional(),
    rate_7: z.number().optional(),
    rate_8: z.number().optional(),
    rate_9: z.number().optional(),
    rate_10: z.number().optional(),
    rate_11: z.number().optional(),
    rate_12: z.number().optional(),
    rate_13: z.number().optional(),
    rate_14: z.number().optional(),
    rate_15: z.number().optional(),
    rate_16: z.number().optional(),
    rate_17: z.number().optional(),
    rate_18: z.number().optional(),
    rate_19: z.number().optional(),
    rate_20: z.number().optional(),
    rate_21: z.number().optional(),
    rate_22: z.number().optional(),
})

export type TChargesRateByTermFormValues = z.infer<
    typeof ChargesRateByTermSchema
>
