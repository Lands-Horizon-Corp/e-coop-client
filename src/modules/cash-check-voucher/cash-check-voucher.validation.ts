import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'
import { entityIdSchema } from '@/validation'

export const CashCheckVoucherSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    cash_voucher_number: z.string().optional(),
    status: z
        .enum(['pending', 'printed', 'approved', 'released'])
        .default('pending')
        .optional(),
    description: z
        .string()
        .transform(descriptionTransformerSanitizer)
        .optional(),
    print_count: z.coerce.number<number>().min(0).optional(),
    pay_to: z.string().optional(),

    // Totals - Added
    total_debit: z.coerce.number().optional(),
    total_credit: z.coerce.number().optional(),

    created_by_user_id: z.string().optional(),
    created_by_user: z.any().optional(),

    released_by_user_id: z.string().optional(),
    released_by_user: z.any().optional(),

    company_id: z.string().optional(),
    member_profile_id: z
        .string()
        .min(1, 'Member profile is required')
        .optional(),
    member_profile: z.any().optional(),

    printed_date: z.string().optional(),
    approved_date: z.string().optional(),
    released_date: z.string().optional(),

    // Signatories - Added
    approved_by_signature_media_id: z.string().optional(),
    approved_by_name: z.string().optional(),
    approved_by_position: z.string().optional(),

    prepared_by_signature_media_id: z.string().optional(),
    prepared_by_name: z.string().optional(),
    prepared_by_position: z.string().optional(),

    certified_by_signature_media_id: z.string().optional(),
    certified_by_name: z.string().optional(),
    certified_by_position: z.string().optional(),

    verified_by_signature_media_id: z.string().optional(),
    verified_by_name: z.string().optional(),
    verified_by_position: z.string().optional(),

    check_by_signature_media_id: z.string().optional(),
    check_by_name: z.string().optional(),
    check_by_position: z.string().optional(),

    acknowledge_by_signature_media_id: z.string().optional(),
    acknowledge_by_name: z.string().optional(),
    acknowledge_by_position: z.string().optional(),

    noted_by_signature_media_id: z.string().optional(),
    noted_by_name: z.string().optional(),
    noted_by_position: z.string().optional(),

    posted_by_signature_media_id: z.string().optional(),
    posted_by_name: z.string().optional(),
    posted_by_position: z.string().optional(),

    paid_by_signature_media_id: z.string().optional(),
    paid_by_name: z.string().optional(),
    paid_by_position: z.string().optional(),

    // Check Entry Fields - Added
    check_entry_amount: z.coerce.number().optional(),
    check_entry_check_number: z.string().optional(),
    check_entry_check_date: z.string().optional(),
    check_entry_account_id: z.string().optional(),

    check_entry_account: z.any().optional(),

    // Entries Arrays - Added
    cash_check_voucher_entries: z.array(z.any()).optional(),
    cash_check_voucher_entries_deleted: z.array(z.string()).optional(),
})

export const CashCheckSignatureSchema = z.object({
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
export const CashCheckVoucherPrintSchema = z.object({
    voucher_number: z.string().min(1, 'Voucher number is required'),
})

export type TCashCheckVoucherPrintSchema = z.infer<
    typeof CashCheckVoucherPrintSchema
>
export type TCashCheckVoucherSchema = z.infer<typeof CashCheckVoucherSchema>
export type TCashCheckSignatureSchema = z.infer<typeof CashCheckSignatureSchema>
