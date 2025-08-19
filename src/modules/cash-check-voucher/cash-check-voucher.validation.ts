import z from 'zod'

import { entityIdSchema } from '@/validation'

export const CashCheckVoucherSchema = z.object({
    employee_user_id: entityIdSchema.optional(),
    transaction_batch_id: entityIdSchema.optional(),
    printed_by_user_id: entityIdSchema.optional(),
    approved_by_user_id: entityIdSchema.optional(),
    released_by_user_id: entityIdSchema.optional(),

    pay_to: z.string().optional(),
    status: z.string().optional(),
    description: z.string().optional(),
    cash_voucher_number: z.string().optional(),
    total_debit: z.number().optional(),
    total_credit: z.number().optional(),
    print_count: z.number().optional(),
    printed_date: z.string().optional(),
    approved_date: z.string().optional(),
    released_date: z.string().optional(),

    approved_by_signature_media_id: entityIdSchema.optional(),
    approved_by_name: z.string().optional(),
    approved_by_position: z.string().optional(),

    prepared_by_signature_media_id: entityIdSchema.optional(),
    prepared_by_name: z.string().optional(),
    prepared_by_position: z.string().optional(),

    certified_by_signature_media_id: entityIdSchema.optional(),
    certified_by_name: z.string().optional(),
    certified_by_position: z.string().optional(),

    verified_by_signature_media_id: entityIdSchema.optional(),
    verified_by_name: z.string().optional(),
    verified_by_position: z.string().optional(),

    check_by_signature_media_id: entityIdSchema.optional(),
    check_by_name: z.string().optional(),
    check_by_position: z.string().optional(),

    acknowledge_by_signature_media_id: entityIdSchema.optional(),
    acknowledge_by_name: z.string().optional(),
    acknowledge_by_position: z.string().optional(),

    noted_by_signature_media_id: entityIdSchema.optional(),
    noted_by_name: z.string().optional(),
    noted_by_position: z.string().optional(),

    posted_by_signature_media_id: entityIdSchema.optional(),
    posted_by_name: z.string().optional(),
    posted_by_position: z.string().optional(),

    paid_by_signature_media_id: entityIdSchema.optional(),
    paid_by_name: z.string().optional(),
    paid_by_position: z.string().optional(),
})

export type ICashCheckVoucherFormValues = z.infer<typeof CashCheckVoucherSchema>
