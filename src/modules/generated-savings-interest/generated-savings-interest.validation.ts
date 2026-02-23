import { z } from 'zod'

import {
    EntityIdSchema,
    entityIdSchema,
    stringDateWithTransformSchema,
} from '@/validation'
import { differenceInDays } from 'date-fns'

import { GENERATED_INTEREST_SAVINGS_COMPUTATION_TYPES } from './generated-savings-interest.constant'

// Base schema without refinements
const GeneratedSavingsInterestBaseSchema = z.object({
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

    interest_tax_rate: z.coerce
        .number<string>()
        .min(0, 'Interest tax rate must be non-negative')
        .max(100, 'Interest tax rate cannot exceed 100'),

    include_closed_account: z.boolean().default(false),
    include_existing_computed_interest: z.boolean().default(false),

    // for view only
    entries: z.array(z.any()).min(1, 'At least one entry is required'),
    total_tax: z.coerce.number().optional(),
    total_interest: z.coerce.number().optional(),
    is_viewing_entries: z.boolean().optional(),
})

export const GeneratedSavingsInterestSchema =
    GeneratedSavingsInterestBaseSchema.superRefine((data, ctx) => {
        if (data.new_computation_date && data.last_computation_date) {
            if (
                differenceInDays(
                    new Date(data.new_computation_date),
                    new Date(data.last_computation_date)
                ) < 30
            ) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['new_computation_date'],
                    message:
                        '30 Days must pass before a new computation can be made',
                })
            }
        }
    })

// Use .omit() on base schema, then add refinements
export const GeneratedSavingsInterestViewSchema =
    GeneratedSavingsInterestBaseSchema.omit({ entries: true }).superRefine(
        (data, ctx) => {
            if (data.new_computation_date && data.last_computation_date) {
                if (
                    differenceInDays(
                        new Date(data.new_computation_date),
                        new Date(data.last_computation_date)
                    ) < 30
                ) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['new_computation_date'],
                        message:
                            '30 Days must pass before a new computation can be made',
                    })
                }
            }
        }
    )

export type TGeneratedSavingsInterestSchema = z.infer<
    typeof GeneratedSavingsInterestSchema
>

export const GenerateSavingsInterestPostSchema = z.object({
    check_voucher_number: z.string().optional().nullable(),

    post_account_id: EntityIdSchema('Post Account is required')
        .optional()
        .nullable(),
    post_account: z.any(),

    entry_date: stringDateWithTransformSchema,
})

export type TGeneratedSavingsInterestPostSchema = z.infer<
    typeof GenerateSavingsInterestPostSchema
>

export type GenerateSavingsInterestPost = z.infer<
    typeof GenerateSavingsInterestPostSchema
>

export const GeneratedSavingsInterestPrintSchema = z.object({
    member_type_id: entityIdSchema.optional().nullable(),
    member_type: z.any().optional(), // for UI display only

    sort_by: z.string(),
})

export type TGeneratedSavingsInterestPrintSchema = z.infer<
    typeof GeneratedSavingsInterestPrintSchema
>
