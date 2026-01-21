import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IComputationSheet } from '../computation-sheet'
import { IncludeNegativeAccountsSchema } from './include-negative-accounts.validation'

export interface IIncludeNegativeAccounts extends IBaseEntityMeta {
    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheet

    account_id: TEntityId
    account: IAccount

    description: string | undefined
}

export type IIncludeNegativeAccountsRequest = z.infer<
    typeof IncludeNegativeAccountsSchema
>

export interface IIncludeNegativeAccountsPaginated
    extends IPaginatedResult<IIncludeNegativeAccounts> {}
