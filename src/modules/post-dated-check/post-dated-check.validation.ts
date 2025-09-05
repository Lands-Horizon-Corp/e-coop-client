import z from 'zod'

import { entityIdSchema } from '@/validation'

export const postDatedCheckSchema = z.object({
    member_profile_id: entityIdSchema.optional(),
    full_name: z.string().optional(),
    passbook_number: z.string().optional(),
    check_number: z.string().optional(),
    check_date: z.string().datetime().optional(),
    clear_days: z.number().optional(),
    date_cleared: z.string().datetime().optional(),
    bank_id: entityIdSchema.optional(),
    amount: z.number().optional(),
    reference_number: z.string().optional(),
    official_receipt_date: z.string().datetime().optional(),
    collateral_user_id: entityIdSchema.optional(),
    description: z.string().optional(),
})

export type TPostDatedCheckFormValuess = z.infer<typeof postDatedCheckSchema>
