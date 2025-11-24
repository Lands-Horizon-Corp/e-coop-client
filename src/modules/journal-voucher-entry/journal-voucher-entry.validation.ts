import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

import { IAccount } from '../account'

export const JournalVoucherEntrySchema = z
    .object({
        id: entityIdSchema.optional(),
        transaction_batch_id: entityIdSchema.optional(),

        loan_transaction: z.any().optional(),
        loan_transaction_id: z.string().optional(),

        member_profile_id: EntityIdSchema('MemberProfile').optional(),
        employee_user_id: EntityIdSchema('EmployeeUser').optional(),

        credit: z.coerce.number<number>().optional(),
        debit: z.coerce.number<number>().optional(),

        account_id: EntityIdSchema('Account'),
        account: z.any().optional(),
        member_profile: z.any().optional(),
    })
    .refine(
        (data) => {
            const account: IAccount | undefined = data.account

            if (account && account.type === 'Loan') {
                if (
                    data.loan_transaction_id === undefined ||
                    data.loan_transaction_id === ''
                ) {
                    return false
                }
            }

            return true
        },
        {
            path: [''],
            message: 'loan_transaction_id is required for Loan accounts',
        }
    )

export type TJournalVoucherEntrySchema = z.infer<
    typeof JournalVoucherEntrySchema
>
