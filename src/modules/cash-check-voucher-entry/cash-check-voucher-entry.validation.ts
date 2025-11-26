import z from 'zod'

import { EntityIdSchema, entityIdSchema } from '@/validation'

import { IAccount, TAccountType } from '../account'

export const CashCheckVoucherEntrySchema = z
    .object({
        id: entityIdSchema.optional(),

        loan_transaction_id: EntityIdSchema('Loan').optional(),
        loan_transaction: z.any().optional(),

        account_id: EntityIdSchema('Account').optional(),
        member_profile_id: EntityIdSchema('MemberProfile').optional(),
        employee_user_id: EntityIdSchema('EmployeeUser').optional(),

        credit: z.coerce.number<number>().optional().default(0),
        debit: z.coerce.number<number>().optional().default(0),

        account: z.any().optional(),
        member_profile: z.any().optional(),
    })
    .refine(
        (data) => {
            const account: IAccount | undefined = data.account

            if (
                account &&
                account?.type &&
                (
                    [
                        'Loan',
                        'SVF-Ledger',
                        'Fines',
                        'Interest',
                    ] as TAccountType[]
                ).includes(account?.type) &&
                !data.loan_transaction_id
            ) {
                return false
            }

            return true
        },
        {
            path: [''],
            message:
                'Loan is required for account type (loan, svf, fines, interest)',
        }
    )

export type TCashCheckVoucherEntrySchema = z.infer<
    typeof CashCheckVoucherEntrySchema
>
