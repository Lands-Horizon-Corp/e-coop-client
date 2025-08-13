import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const automaticLoanDeductionSchema = z.object({
    id: entityIdSchema.optional(),

    account_id: entityIdSchema,
    account: z.any().optional(), // pang display lang to dont worry
    computation_sheet_id: entityIdSchema,

    name: z.string().min(1, { message: 'Name is required' }),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),

    charges_percentage_1: z.coerce.number().nonnegative(),
    charges_percentage_2: z.coerce.number().nonnegative(),
    charges_amount: z.coerce.number().nonnegative(),
    charges_divisor: z.coerce.number().positive().default(1),

    min_amount: z.coerce.number().nonnegative(),
    max_amount: z.coerce.number().nonnegative(),

    anum: z.coerce.number().int().min(1),

    link_account_id: entityIdSchema.optional(),
    link_account: z.any().optional(),

    add_on: z.boolean().default(false),
    ao_rest: z.boolean().default(false),
    exclude_renewal: z.boolean().default(false),

    ct: z.coerce.number().optional(),
})
