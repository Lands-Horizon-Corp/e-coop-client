import z from 'zod'

import { descriptionTransformerSanitizer, entityIdSchema } from '@/validation'

// use by transaction batch create form
export const TransactionBatchCreateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount is required'),
    description: z.coerce
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
    organization_id: z.string().optional(),
    branch_id: z.string().optional(),
    provided_by_user_id: entityIdSchema
        .min(1, 'Provider is required')
        .optional(),

    currency_id: entityIdSchema,
    currency: z.any(),

    provided_by_user: z.any(),
    signature_media_id: z.string().optional(),
    signature_media: z.any(),
})

// ending transaction batch
export const TransactionBatchEndSchema = z.object({
    employee_by_signature_media_id: entityIdSchema.min(
        1,
        'Signature is required'
    ),
    employee_by_signature_media: z.any(),
    employee_by_name: z.string().min(1, 'Name is required'),
    employee_by_position: z.string().min(1, 'Position is required'),
})

// for signature
export const BatchSignSchema = z.object({
    prepared_by_signature_media_id: entityIdSchema.optional(),
    prepared_by_signature_media: z.any(),
    prepared_by_name: z.coerce.string().optional(),
    prepared_by_position: z.coerce.string().optional(),

    certified_by_signature_media_id: entityIdSchema.optional(),
    certified_by_signature_media: z.any(),
    certified_by_name: z.coerce.string().optional(),
    certified_by_position: z.coerce.string().optional(),

    approved_by_signature_media_id: entityIdSchema.optional(),
    approved_by_signature_media: z.any(),
    approved_by_name: z.coerce.string().optional(),
    approved_by_position: z.coerce.string().optional(),

    verified_by_signature_media_id: entityIdSchema.optional(),
    verified_by_signature_media: z.any(),
    verified_by_name: z.coerce.string().optional(),
    verified_by_position: z.coerce.string().optional(),

    check_by_signature_media_id: entityIdSchema.optional(),
    check_by_signature_media: z.any(),
    check_by_name: z.coerce.string().optional(),
    check_by_position: z.coerce.string().optional(),

    acknowledge_by_signature_media_id: entityIdSchema.optional(),
    acknowledge_by_signature_media: z.any(),
    acknowledge_by_name: z.coerce.string().optional(),
    acknowledge_by_position: z.coerce.string().optional(),

    noted_by_signature_media_id: entityIdSchema.optional(),
    noted_by_signature_media: z.any(),
    noted_by_name: z.coerce.string().optional(),
    noted_by_position: z.coerce.string().optional(),

    posted_by_signature_media_id: entityIdSchema.optional(),
    posted_by_signature_media: z.any(),
    posted_by_name: z.coerce.string().optional(),
    posted_by_position: z.coerce.string().optional(),

    paid_by_signature_media_id: entityIdSchema.optional(),
    paid_by_signature_media: z.any(),
    paid_by_name: z.coerce.string().optional(),
    paid_by_position: z.coerce.string().optional(),
})

// FOR Transaction Batch DEPOSIT IN BANK
export const DepositInBankSchema = z.object({
    deposit_in_bank: z.coerce.number().min(0, 'Deposit in bank is required'),
    currency: z.any().optional(),
    currency_id: entityIdSchema,
})

export type TDepositInBankSchema = z.infer<typeof DepositInBankSchema>
