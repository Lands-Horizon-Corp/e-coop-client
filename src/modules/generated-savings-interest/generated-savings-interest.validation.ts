import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

import { GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES } from './generated-savings-interest.constant'

export const GeneratedSavingsInterestSchema = z.object({
    id: EntityIdSchema().optional(),
    document_no: z.string().optional(),

    last_computation_date: z
        .string()
        .min(1, 'Last computation date is required'),
    new_computation_date: z.string().min(1, 'New computation date is required'),

    account_id: entityIdSchema.optional().nullable(),
    account: z.any().optional(),

    member_type_id: entityIdSchema.optional().nullable(),
    member_type: z.any().optional(),

    savings_computation_type: z.enum(
        GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES,
        'Invalid computation type'
    ),

    interest_tax_rate: z
        .number()
        .min(0, 'Interest tax rate must be non-negative')
        .max(100, 'Interest tax rate cannot exceed 100'),

    include_closed_account: z.boolean().default(false),
    include_existing_computed_interest: z.boolean().default(false),

    // for view only
    entries: z.array(z.any()).min(1),
    is_viewing_entries: z.boolean().optional(),
})

export const GeneratedSavingsInterestViewSchema =
    GeneratedSavingsInterestSchema.omit({ entries: true })

export type TGeneratedSavingsInterestSchema = z.infer<
    typeof GeneratedSavingsInterestSchema
>
