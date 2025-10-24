import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

export const AutomaticLoanDeductionSchema = z.object({
    id: entityIdSchema.optional(),

    account_id: entityIdSchema,
    account: z.any().optional(), // pang display lang to dont worry
    computation_sheet_id: entityIdSchema,

    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    charges_percentage_1: z.coerce.number().nonnegative(),
    charges_percentage_2: z.coerce.number().nonnegative(),
    charges_amount: z.coerce.number().nonnegative(),
    charges_divisor: z.coerce.number(),

    min_amount: z.coerce.number().nonnegative(),
    max_amount: z.coerce.number().nonnegative(),

    anum: z.coerce.number().int(),

    charges_rate_scheme_id: entityIdSchema.optional(),

    add_on: z.boolean().default(false),
    ao_rest: z.boolean().default(false),
    exclude_renewal: z.boolean().default(false),

    ct: z.coerce.number().optional(),
})

export type TAutomaticLoanDeductionSchema = z.infer<
    typeof AutomaticLoanDeductionSchema
>
