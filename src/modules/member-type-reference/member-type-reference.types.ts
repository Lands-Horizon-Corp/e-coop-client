import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IAccount } from '../account'
import { IMemberType } from '../member-type/member-type.types'
import { TMemberTypeReferenceSchema } from './member-type-reference.validation'

// LATEST FROM ERD
export type IMemberTypeReferenceRequest = TMemberTypeReferenceSchema

// LATEST FROM ERD
export interface IMemberTypeReference extends IBaseEntityMeta {
    id: TEntityId

    name: string

    account_id: TEntityId
    account: IAccount

    member_type_id: TEntityId
    member_type: IMemberType

    maintaining_balance: number
    description: string
    minimum_balance: number
    interest_rate: number
    charges: number

    other_interest_on_saving_computation_minimum_balance?: number
    other_interest_on_saving_computation_interest_rate?: number

    interest_rates_by_year: any[]
    interest_rates_by_date: any[]
    interest_rates_by_amount: any[]
}

export interface IMemberTypeReferencePaginated
    extends IPaginatedResult<IMemberTypeReference> {}
