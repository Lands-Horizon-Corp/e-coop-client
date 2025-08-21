import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IAccount } from '../account'
import { IMemberType } from '../member-type/member-type.types'
import { MemberTypeReferenceSchema } from './member-type-reference.validation'

// LATEST FROM ERD
export type IMemberTypeReferenceRequest = z.infer<
    typeof MemberTypeReferenceSchema
>

// LATEST FROM ERD
export interface IMemberTypeReference extends IBaseEntityMeta {
    id: TEntityId

    account_id: TEntityId
    account: IAccount

    member_type_id: TEntityId
    member_type: IMemberType

    maintaining_balance: number
    description: string
    interest_rate: number
    minimum_balance: number
    charges: number
    active_member_minimum_balance: number
    active_member_ratio: number

    other_interest_on_saving_computation_minimum_balance: number
    other_interest_on_saving_computation_interest_rate: number
}

export interface IMemberTypeReferencePaginated
    extends IPaginatedResult<IMemberTypeReference> {}
