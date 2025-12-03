import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult } from '@/types'

import { IMemberProfile } from '../member-profile'
import { MUTUAL_FUND_COMPUTATION_TYPES } from './mutual-fund.constant'
import { MutualFundSchema } from './mutual-fund.validation'

export type TMutualFundComputationType =
    (typeof MUTUAL_FUND_COMPUTATION_TYPES)[number]

export interface IMutualFund extends IBaseEntityMeta {
    member_profile_id: string
    member_profile?: IMemberProfile
    mutual_aid_contribution_id?: string
    // mutual_aid_contribution?: IMutualAidContribution
    // additional_members?: IMutualFundAdditionalMember[]
    name: string
    description: string
    date_of_death: string
    extension_only: boolean
    amount: number
    computation_type: TMutualFundComputationType
}

export type IMutualFundRequest = z.infer<typeof MutualFundSchema>

export interface IMutualFundPaginated extends IPaginatedResult<IMutualFund> {}
