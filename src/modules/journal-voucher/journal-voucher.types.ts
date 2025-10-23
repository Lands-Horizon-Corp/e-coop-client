import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { ICurrency } from '../currency'
import {
    IJournalVoucherEntry,
    IJournalVoucherEntryRequest,
} from '../journal-voucher-entry'
import { IJournalVoucherTag } from '../journal-voucher-tag'
import { IMemberProfile } from '../member-profile'
import { IUser } from '../user'

export interface IJournalVoucher extends IBaseEntityMeta {
    cash_voucher_number: string
    date: string
    description?: string
    reference: string
    status: TJournalVoucherStatus
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

    journal_voucher_tags?: IJournalVoucherTag[]
    journal_voucher_entries?: IJournalVoucherEntry[]

    total_debit: number
    total_credit: number
}

export interface IJournalVoucherRequest {
    cash_voucher_number?: string
    date: string
    description?: string
    reference?: string
    status?: string

    currency_id: TEntityId
    currency: ICurrency

    journal_voucher_entries?: IJournalVoucherEntryRequest[]
    journal_voucher_entries_deleted?: TEntityId[]
}

export interface IJournalVoucherPrintRequest {
    cash_voucher_number: string
}

export type TJournalVoucherStatus =
    | 'draft'
    | 'printed'
    | 'approved'
    | 'released'

export enum EJournalVoucherStatus {
    Draft = 'draft',
    Posted = 'posted',
    Cancelled = 'cancelled',
}

export type TJournalVoucherMode = 'draft' | 'printed' | 'approved' | 'released'

export type TPrintMode = 'print' | 'print-undo' | 'approve'

export type TJournalActionMode = 'approve-undo' | 'release' | 'print-only'

export interface IJournalVoucherPaginated
    extends IPaginatedResult<IJournalVoucher> {}
