import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IMemberProfile } from '../member-profile'
import { IMutualFundAdditionalMembers } from '../mutual-fund-additional-members'
import { IMutualFundEntry } from '../mutual-fund-entry'
import { IMutualFundTable } from '../mutual-fund-table'
import { IUser } from '../user'
import { MUTUAL_FUND_COMPUTATION_TYPES } from './mutual-fund.constant'
import {
    MutualFundSchema,
    MutualFundViewSchema,
    TMutualFundPrintSchema,
    TMutualFundViewPostRequestSchema,
} from './mutual-fund.validation'

export type TMutualFundComputationType =
    (typeof MUTUAL_FUND_COMPUTATION_TYPES)[number]

export interface IMutualFund extends IBaseEntityMeta {
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    mutual_fund_table_id?: TEntityId

    account: IAccount
    account_id: TEntityId

    mutual_fund_table?: IMutualFundTable
    additional_members?: IMutualFundAdditionalMembers[]

    name: string
    description: string
    date_of_death: string
    extension_only: boolean
    amount: number
    computation_type: TMutualFundComputationType

    entries?: IMutualFundEntry[]

    // Printing fields
    printed_by_user_id?: TEntityId
    printed_by_user?: IUser
    printed_date?: string

    // Posting fields
    posted_date?: string
    post_account_id?: TEntityId
    post_account?: IAccount
    posted_by_user_id?: TEntityId
    posted_by_user?: IUser
}

export type IMutualFundRequest = z.infer<typeof MutualFundSchema>

export type IMutualFundViewRequest = z.infer<typeof MutualFundViewSchema>

export interface IMutualFundView {
    mutual_fund: IMutualFund

    mutual_fund_entries?: IMutualFundEntry[]
    total_amount: number
}

export type IMutualFundPostRequest = TMutualFundViewPostRequestSchema

export type IMutualFundPrintRequest = TMutualFundPrintSchema

export interface IMutualFundPaginated extends IPaginatedResult<IMutualFund> {}
