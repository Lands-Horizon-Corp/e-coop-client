import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { ILoanTransaction } from '../loan-transaction'
import { IMemberProfile } from '../member-profile'
import { ComakerMemberProfileSchema } from './comaker-member-profile.validation'

export interface IComakerMemberProfile extends IBaseEntityMeta {
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    description: string
    amount: number
    months_count: number
    year_count: number
}

export type IComakerMemberProfileRequest = z.infer<
    typeof ComakerMemberProfileSchema
>

export interface IComakerMemberProfilePaginated
    extends IPaginatedResult<IComakerMemberProfile> {}
