import z from 'zod'

import {
    EntityIdSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

export const ComputationSheetSchema = z.object({
    id: entityIdSchema.optional(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    name: z.string().min(1, { message: 'Name is required' }),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),

    currency_id: EntityIdSchema('Currency is required'),
    currency: z.any().optional(),

    deliquent_account: z.boolean(),
    fines_account: z.boolean(),
    interest_account: z.boolean(),
    comaker_account: z.coerce.number().default(-1),
    exist_account: z.boolean(),
})

export type TComputationSheetSchema = z.infer<typeof ComputationSheetSchema>
