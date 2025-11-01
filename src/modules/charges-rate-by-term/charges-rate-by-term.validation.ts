import z from 'zod'

import { EntityIdSchema, PercentageSchema, entityIdSchema } from '@/validation'

import { LOAN_MODE_OF_PAYMENT } from '../loan-transaction/loan.constants'

export const ChargesRateByTermSchema = z.object({
    id: EntityIdSchema('Charges Rate By Term id is invalid').optional(),
    charges_rate_scheme_id: entityIdSchema.optional(),
    mode_of_payment: z.enum(LOAN_MODE_OF_PAYMENT),

    rate_1: PercentageSchema.optional(),
    rate_2: PercentageSchema.optional(),
    rate_3: PercentageSchema.optional(),
    rate_4: PercentageSchema.optional(),
    rate_5: PercentageSchema.optional(),
    rate_6: PercentageSchema.optional(),
    rate_7: PercentageSchema.optional(),
    rate_8: PercentageSchema.optional(),
    rate_9: PercentageSchema.optional(),
    rate_10: PercentageSchema.optional(),
    rate_11: PercentageSchema.optional(),
    rate_12: PercentageSchema.optional(),
    rate_13: PercentageSchema.optional(),
    rate_14: PercentageSchema.optional(),
    rate_15: PercentageSchema.optional(),
    rate_16: PercentageSchema.optional(),
    rate_17: PercentageSchema.optional(),
    rate_18: PercentageSchema.optional(),
    rate_19: PercentageSchema.optional(),
    rate_20: PercentageSchema.optional(),
    rate_21: PercentageSchema.optional(),
    rate_22: PercentageSchema.optional(),
})

export type TChargesRateByTermSchema = z.infer<typeof ChargesRateByTermSchema>
