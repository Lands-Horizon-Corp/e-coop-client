import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IAccountHistory } from '../account-history'
import { LoanTransaction } from '../automatic-loan-deduction'
import { LoanAccountSchema } from './loan-account.validation'

export interface ILoanAccount extends IBaseEntityMeta {
    id: string

    loan_transaction_id: TEntityId
    loan_transaction?: LoanTransaction

    account_id: TEntityId
    account: IAccount

    account_history_id?: TEntityId
    account_history?: IAccountHistory

    amount: number

    total_add: number
    total_add_count: number

    total_deduction: number
    total_deduction_count: number

    total_payment: number
    total_payment_count: number
}

export type ILoanAccountRequest = z.infer<typeof LoanAccountSchema>

export interface ILoanAccountPaginated extends IPaginatedResult<ILoanAccount> {}
