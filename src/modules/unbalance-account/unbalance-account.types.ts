import z from 'zod'

import { IAccount } from '@/modules/account'
import { ICurrency } from '@/modules/currency'
import { IMemberProfile } from '@/modules/member-profile'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { UnbalanceAccountSchema } from './unbalance-account.validation'

export interface IUnbalanceAccount extends IBaseEntityMeta {
    currency_id: TEntityId
    currency: ICurrency

    account_for_shortage_id: TEntityId
    account_for_shortage: IAccount

    account_for_overage_id: TEntityId
    account_for_overage: IAccount

    member_profile_id_for_shortage?: TEntityId
    member_profile_for_shortage?: IMemberProfile

    member_profile_id_for_overage?: TEntityId
    member_profile_for_overage?: IMemberProfile

    name: string
    description: string
}

export type IUnbalanceAccountRequest = z.infer<typeof UnbalanceAccountSchema>

export interface IUnbalanceAccountPaginated
    extends IPaginatedResult<IUnbalanceAccount> {}
