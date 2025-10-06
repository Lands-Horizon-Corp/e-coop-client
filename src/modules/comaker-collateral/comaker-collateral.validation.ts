import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const ComakerCollateralSchema = z.object({
    id: entityIdSchema.optional(),

    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    loan_transaction_id: entityIdSchema.optional(), // set by server

    collateral_id: EntityIdSchema('Collateral'),
    collateral: z.any().optional(),

    amount: z.coerce.number().min(0, 'Amount must be a positive number'),
    months_count: z.coerce.number().int().default(0),
    year_count: z.coerce.number().default(0),
})

export type TComakerCollateralSchema = z.infer<typeof ComakerCollateralSchema>
