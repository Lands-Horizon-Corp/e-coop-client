import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IMemberType } from '../member-type'
import { IMutualFund } from '../mutual-fund/mutual-fund.types'
import { MutualFundAdditionalMembersSchema } from './mutual-fund-additional-members.validation'

export interface IMutualFundAdditionalMembers extends IBaseEntityMeta {
    mutual_fund_id: string
    mutual_fund?: IMutualFund

    member_type_id: string
    member_type?: IMemberType

    number_of_members: number
    ratio: number
}

export type IMutualFundAdditionalMembersRequest = z.infer<
    typeof MutualFundAdditionalMembersSchema
>

export interface IMutualFundAdditionalMembersPaginated
    extends IPaginatedResult<IMutualFundAdditionalMembers> {}
