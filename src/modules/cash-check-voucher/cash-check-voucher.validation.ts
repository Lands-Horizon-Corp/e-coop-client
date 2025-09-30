import z from 'zod'

import { descriptionTransformerSanitizer } from '@/validation'

export const CashCheckVoucherSchema = z.object({
    name: z.string().optional(),
    cash_voucher_number: z.string().optional(),
    // date: z.string().min(1, 'Date is required'),
    status: z
        .enum(['pending', 'printed', 'approved', 'released'])
        .default('pending')
        .optional(),
    description: z
        .string()
        .optional()
        .transform(descriptionTransformerSanitizer),
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

    // Entries Arrays - Added
    cash_check_voucher_entries: z.array(z.any()).optional(),
    cash_check_voucher_entries_deleted: z.array(z.string()).optional(),
})

export type TCashCheckVoucherSchema = z.infer<typeof CashCheckVoucherSchema>
