import { IAccount } from '@/modules/account/account.types'
import { ILoanTransaction } from '@/modules/loan-transaction/loan-transaction.types'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { LOAN_TRANSACTION_ENTRY_TYPE } from './loan-transaction-constant'
import { TLoanTransactionEntrySchema } from './loan-transaction-entry.validation'

export type TLoanTransactionEntryType =
    (typeof LOAN_TRANSACTION_ENTRY_TYPE)[number]

export interface ILoanTransactionEntry extends IBaseEntityMeta {
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction

    index?: number

    account_id?: TEntityId
    account?: IAccount

    name: string // incase madelete yung account, nakasurvive yung name
    description: string

    credit: number
    debit: number

    amount: number

    is_add_on: boolean //
    type: TLoanTransactionEntryType //
}

export type ILoanTransactionEntryRequest = TLoanTransactionEntrySchema

export interface ILoanTransactionEntryPaginated
    extends IPaginatedResult<ILoanTransactionEntry> {}
