import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { TransactionsSchema } from './transactions.validation'

export interface ITransactions extends IBaseEntityMeta {
    id: TEntityId
    //add here
}

export type ITransactionsRequest = z.infer<typeof TransactionsSchema>

export interface ITransactionsPaginated
    extends IPaginatedResult<ITransactions> {}
