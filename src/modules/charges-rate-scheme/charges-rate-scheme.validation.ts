import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { ChargesRateByRangeOrMinimumAmountSchema } from '../charges-rate-by-range-or-minimum-amount'
import { ChargesRateByTermSchema } from '../charges-rate-by-term'
import { chargesRateSchemeAccountSchema } from '../charges-rate-scheme-account'
import { ChargesRateSchemeModeOfPaymentSchema } from '../charges-rate-scheme-mode-of-payment'
import { CHARGES_RATE_SCHEME_TYPE } from './charges-rate.constant'

export const ChargesRateCreateSchemeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'ChargesRateScheme name is required'),
    description: z
        .string()
        .min(10, 'Min 10 character description')
        .optional()
        .transform(descriptionTransformerSanitizer),

    icon: z.string().optional(),
    currency: z.any().optional(),
    currency_id: EntityIdSchema('Currency is required'),

    charges_rate_scheme_accounts: z
        .array(chargesRateSchemeAccountSchema)
        .default([]),
})

export type TChargesRateCreateSchemeSchema = z.infer<
    typeof ChargesRateSchemeSchema
>

export const ChargesRateSchemeSchema = ChargesRateCreateSchemeSchema.extend({
    id: entityIdSchema.optional(),
    type: z.enum(CHARGES_RATE_SCHEME_TYPE).default('by_range'),

    charges_rate_scheme_accounts_deleted: z.array(entityIdSchema).optional(),

    charges_rate_by_range_or_minimum_amounts: z
        .array(ChargesRateByRangeOrMinimumAmountSchema)
        .optional(),
    charges_rate_by_range_or_minimum_amounts_deleted: z
        .array(entityIdSchema)
        .optional(),

    by_term_header_1: z.coerce.number().int().optional(),
    by_term_header_2: z.coerce.number().int().optional(),
    by_term_header_3: z.coerce.number().int().optional(),
    by_term_header_4: z.coerce.number().int().optional(),
    by_term_header_5: z.coerce.number().int().optional(),
    by_term_header_6: z.coerce.number().int().optional(),
    by_term_header_7: z.coerce.number().int().optional(),
    by_term_header_8: z.coerce.number().int().optional(),
    by_term_header_9: z.coerce.number().int().optional(),
    by_term_header_10: z.coerce.number().int().optional(),
    by_term_header_11: z.coerce.number().int().optional(),
    by_term_header_12: z.coerce.number().int().optional(),
    by_term_header_13: z.coerce.number().int().optional(),
    by_term_header_14: z.coerce.number().int().optional(),
    by_term_header_15: z.coerce.number().int().optional(),
    by_term_header_16: z.coerce.number().int().optional(),
    by_term_header_17: z.coerce.number().int().optional(),
    by_term_header_18: z.coerce.number().int().optional(),
    by_term_header_19: z.coerce.number().int().optional(),
    by_term_header_20: z.coerce.number().int().optional(),
    by_term_header_21: z.coerce.number().int().optional(),
    by_term_header_22: z.coerce.number().int().optional(),
    charges_rate_by_terms: z.array(ChargesRateByTermSchema).optional(),
    charges_rate_by_terms_deleted: z.array(entityIdSchema).optional(),

    mode_of_payment_header_1: z.coerce.number().int().optional(),
    mode_of_payment_header_2: z.coerce.number().int().optional(),
    mode_of_payment_header_3: z.coerce.number().int().optional(),
    mode_of_payment_header_4: z.coerce.number().int().optional(),
    mode_of_payment_header_5: z.coerce.number().int().optional(),
    mode_of_payment_header_6: z.coerce.number().int().optional(),
    mode_of_payment_header_7: z.coerce.number().int().optional(),
    mode_of_payment_header_8: z.coerce.number().int().optional(),
    mode_of_payment_header_9: z.coerce.number().int().optional(),
    mode_of_payment_header_10: z.coerce.number().int().optional(),
    mode_of_payment_header_11: z.coerce.number().int().optional(),
    mode_of_payment_header_12: z.coerce.number().int().optional(),
    mode_of_payment_header_13: z.coerce.number().int().optional(),
    mode_of_payment_header_14: z.coerce.number().int().optional(),
    mode_of_payment_header_15: z.coerce.number().int().optional(),
    mode_of_payment_header_16: z.coerce.number().int().optional(),
    mode_of_payment_header_17: z.coerce.number().int().optional(),
    mode_of_payment_header_18: z.coerce.number().int().optional(),
    mode_of_payment_header_19: z.coerce.number().int().optional(),
    mode_of_payment_header_20: z.coerce.number().int().optional(),
    mode_of_payment_header_21: z.coerce.number().int().optional(),
    mode_of_payment_header_22: z.coerce.number().int().optional(),
    charges_rate_scheme_model_of_payments: z
        .array(ChargesRateSchemeModeOfPaymentSchema)
        .optional(),
    charges_rate_scheme_model_of_payments_deleted: z
        .array(entityIdSchema.optional())
        .optional(),
})

export type TChargesRateSchemeSchema = z.infer<typeof ChargesRateSchemeSchema>
