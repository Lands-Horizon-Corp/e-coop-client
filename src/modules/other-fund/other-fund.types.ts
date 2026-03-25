import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { ICurrency } from '../currency'
import { IGeneratedReportRequest } from '../generated-report'
import { IMemberProfile } from '../member-profile'
import { IOtherFundEntry, IOtherFundEntryRequest } from '../other-fund-entry'
import { IOtherFundTag } from '../other-fund-tag'
import { IUser } from '../user'

export interface IOtherFund extends IBaseEntityMeta {
    cash_voucher_number: string
    date: string
    description?: string
    reference: string
    name: string

    currency_id: TEntityId
    currency: ICurrency

    printed_by_user_id?: string
    printed_by?: IUser

    approved_by_user_id?: string
    approved_by?: IUser

    released_by_user_id?: string
    released_by?: IUser

    posted_at?: string
    posted_by_id?: TEntityId
    posted_by?: IUser

    printed_date?: string
    print_number?: number
    approved_date?: string
    released_date?: string

    member_profile?: IMemberProfile

    other_fund_tags?: IOtherFundTag[]
    other_fund_entries?: IOtherFundEntry[]

    total_debit: number
    total_credit: number

    employee_user: IUser
}

export interface IOtherFundRequest {
    cash_voucher_number?: string
    date: string
    description?: string
    reference?: string
    status?: string

    currency_id: TEntityId

    other_fund_entries?: IOtherFundEntryRequest[]
    other_fund_entries_deleted?: TEntityId[]
}

export interface IOtherFundPrintRequest {
    cash_voucher_number: string
    or_auto_generated?: boolean
    reportConfig?: IGeneratedReportRequest
}

export enum EOtherFundStatus {
    Draft = 'draft',
    Posted = 'posted',
    Cancelled = 'cancelled',
}

export type TOtherFundMode =
    | 'draft'
    | 'printed'
    | 'approved'
    | 'released'
    | 'release-today'

export type TPrintMode = 'print' | 'print-undo' | 'approve'

export type TOtherFundActionMode =
    | 'approve-undo'
    | 'release'
    | 'release-undo'
    | 'print-only'

export interface IOtherFundPaginated extends IPaginatedResult<IOtherFund> {}
