import { z } from 'zod'

import {
    EntityIdSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'

import { GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES } from './generated-savings-interest.constant'

export const GeneratedSavingsInterestSchema = z.object({
    id: EntityIdSchema().optional(),
    document_no: z.string().optional(),

    last_computation_date: stringDateWithTransformSchema,
    new_computation_date: stringDateWithTransformSchema,

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

export const GenerateSavingsInterestPostSchema = z.object({
    check_voucher_number: z.string().optional().nullable(),

    post_account_id: EntityIdSchema('Post Account is required'),
    post_account: z.any(),

    entry_date: stringDateWithTransformSchema,
})

export type TGeneratedSavingsInterestPostSchema = z.infer<
    typeof GenerateSavingsInterestPostSchema
>

export type GenerateSavingsInterestPost = z.infer<
    typeof GenerateSavingsInterestPostSchema
>
