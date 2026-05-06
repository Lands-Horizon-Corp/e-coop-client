import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account/account.types'
import { AccountConsolidationSchema } from './account-consolidation.validation'

export interface IAccountConsolidation extends IBaseEntityMeta {
    primary_account_id: TEntityId
    primary_account: IAccount

    linked_account: IAccount
    linked_account_id: TEntityId
}

export type IAccountConsolidationRequest = z.infer<
    typeof AccountConsolidationSchema
>

export interface IAccountConsolidationPaginated extends IPaginatedResult<IAccountConsolidation> {}
