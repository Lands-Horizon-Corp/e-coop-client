import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '../common'

export const memberTypeReferenceSchema = z.object({
    id: entityIdSchema.optional(),

    description: descriptionSchema.transform(descriptionTransformerSanitizer),
    account_id: entityIdSchema,
    account: z.any(),
    member_type_id: entityIdSchema,

    interest_rate: z.coerce.number().min(0, 'Interest rate is required'),
    charges: z.coerce.number().min(0, 'Charges are required'),

    minimum_balance: z.coerce.number().min(0, 'Minimum balance is required'),
    maintaining_balance: z.coerce
        .number()
        .min(0, 'Maintaining balance is required'),

    active_member_ratio: z.coerce.number().min(0),
    active_member_minimum_balance: z.coerce.number().min(0),

    other_interest_on_saving_computation_minimum_balance: z.coerce
        .number()
        .min(0),
    other_interest_on_saving_computation_interest_rate: z.coerce
        .number()
        .min(0),
})
