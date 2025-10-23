import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

export const CashCheckVoucherEntrySchema = z.object({
    id: entityIdSchema.optional(),

    cash_check_voucher_number: z.string().optional(),
    account_id: EntityIdSchema('Account').optional(),
    member_profile_id: EntityIdSchema('MemberProfile').optional(),
    employee_user_id: EntityIdSchema('EmployeeUser').optional(),

    credit: z.coerce.number<number>().optional().default(0),
    debit: z.coerce.number<number>().optional().default(0),

    account: z.any().optional(),
    member_profile: z.any().optional(),
})

export type TCashCheckVoucherEntrySchema = z.infer<
    typeof CashCheckVoucherEntrySchema
>
