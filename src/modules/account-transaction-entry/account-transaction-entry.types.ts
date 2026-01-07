import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccountTransaction } from '../account-transaction/account-transaction.types'
import { IAccount } from '../account/account.types'
import { AccountTransactionEntrySchema } from './account-transaction-entry.validation'

export interface IAccountTransactionEntry extends IBaseEntityMeta {
    account_transaction_id: TEntityId
    account_transaction: IAccountTransaction

    account_id: TEntityId
    account: IAccount

    jv_number: string

    date: string

    debit: number
    credit: number

    balance: number
}

export type IAccountTransactionEntryRequest = z.infer<
    typeof AccountTransactionEntrySchema
>

export interface IAccountTransactionEntryPaginated
    extends IPaginatedResult<IAccountTransactionEntry> {}
