import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IAccountTransactionEntry } from '../account-transaction-entry'
import { ACCOUNT_TRANSACTION_SOURCE } from './account-transaction-constants'
import {
    AccountTransactionSchema,
    TAccountTransactionGenerateSchema,
} from './account-transaction.validation'

export type TAccountTransactionSource =
    (typeof ACCOUNT_TRANSACTION_SOURCE)[number]

export interface IAccountTransaction extends IBaseEntityMeta {
    source: TAccountTransactionSource

    jv_number: string
    date: string
    description: string

    debit: number
    credit: number

    entries: IAccountTransactionEntry[]
}

export type IAccountTransactionRequest = z.infer<
    typeof AccountTransactionSchema
>

export type IAccountTransactionGenerateRequest =
    TAccountTransactionGenerateSchema

export interface IAccountTransactionLedger {
    account_transaction_entry: IAccountTransactionEntry[]
    month: number
    debit: number
    credit: number
}

export interface IAccountTransactionPaginated extends IPaginatedResult<IAccountTransaction> {}
