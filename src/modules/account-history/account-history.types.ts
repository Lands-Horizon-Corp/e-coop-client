import z from 'zod'

import { IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account/account.types'
import { AccountHistorySchema } from './account-history.validation'

// export const HISTORY_CHANGE_TYPE = ['created', 'updated', 'deleted'] as const

// export type THistoryChangeType = (typeof HISTORY_CHANGE_TYPE)[number]

export interface IAccountHistory extends IAccount {
    account_id: TEntityId
    account: IAccount
    // change_type: THistoryChangeType
}

export type IAccountHistoryRequest = z.infer<typeof AccountHistorySchema>

export interface IAccountHistoryPaginated
    extends IPaginatedResult<IAccountHistory> {}
