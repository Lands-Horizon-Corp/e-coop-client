import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { ICashCheckVoucherEntry, ICashCheckVoucherEntryRequest } from '../cash-check-voucher-entry'
import { ICashCheckVoucherTag } from '../cash-check-voucher-tag'
import { IMedia } from '../media'
import { IMemberProfile } from '../member-profile'
import { ITransactionBatch } from '../transaction-batch'
import { IUser } from '../user'

// Enum for status
export type CashCheckVoucherStatus =
    | 'pending'
    | 'printed'
    | 'approved'
    | 'released'

export enum ECashCheckVoucherStatus {
    Pending = 'pending',
    Printed = 'printed',
    Approved = 'approved',
    Released = 'released',
}

export interface ICashCheckVoucher extends IBaseEntityMeta {
    member_profile_id?: string
    member_profile?: IMemberProfile

    employee_user_id?: string
    employee_user?: IUser

    transaction_batch_id?: string
    transaction_batch?: ITransactionBatch

    printed_by_user_id?: string
    printed_by_user?: IUser

    approved_by_user_id?: string
    approved_by_user?: IUser

    released_by_user_id?: string
    released_by_user?: IUser

    pay_to: string

    status: CashCheckVoucherStatus
    description: string
    cash_voucher_number: string
    total_debit: number
    total_credit: number
    print_count: number
    printed_date?: string
    approved_date?: string
    released_date?: string
    date?: string

    //signatories
    approved_by_signature_media_id?: string
    approved_by_signature_media?: IMedia
    approved_by_name: string
    approved_by_position: string

    prepared_by_signature_media_id?: string
    prepared_by_signature_media?: IMedia
    prepared_by_name: string
    prepared_by_position: string

    certified_by_signature_media_id?: string
    certified_by_signature_media?: IMedia
    certified_by_name: string
    certified_by_position: string

    verified_by_signature_media_id?: string
    verified_by_signature_media?: IMedia
    verified_by_name: string
    verified_by_position: string

    check_by_signature_media_id?: string
    check_by_signature_media?: IMedia
    check_by_name: string
    check_by_position: string

    acknowledge_by_signature_media_id?: string
    acknowledge_by_signature_media?: IMedia
    acknowledge_by_name: string
    acknowledge_by_position: string

    noted_by_signature_media_id?: string
    noted_by_signature_media?: IMedia
    noted_by_name: string
    noted_by_position: string

    posted_by_signature_media_id?: string
    posted_by_signature_media?: IMedia
    posted_by_name: string
    posted_by_position: string

    paid_by_signature_media_id?: string
    paid_by_signature_media?: IMedia
    paid_by_name: string
    paid_by_position: string

    check_entry_amount: number
    check_entry_check_number: string
    check_entry_check_date?: string
    check_entry_account_id?: string
    check_entry_account?: IAccount

    cash_check_voucher_tags?: ICashCheckVoucherTag[]
    cash_check_voucher_entries?: ICashCheckVoucherEntry[]
}

export interface ICashCheckVoucherRequest {
    member_profile_id?: string
    employee_user_id?: string
    transaction_batch_id?: string
    printed_by_user_id?: string
    approved_by_user_id?: string
    released_by_user_id?: string

    pay_to: string
    status: CashCheckVoucherStatus
    description?: string
    cash_voucher_number: string
    total_debit?: number
    total_credit?: number
    print_count?: number

    date?: string // ADDED
    printed_date?: string
    approved_date?: string
    released_date?: string

    // signatories
    approved_by_signature_media_id?: string
    approved_by_name?: string
    approved_by_position?: string

    prepared_by_signature_media_id?: string
    prepared_by_name?: string
    prepared_by_position?: string

    certified_by_signature_media_id?: string
    certified_by_name?: string
    certified_by_position?: string

    verified_by_signature_media_id?: string
    verified_by_name?: string
    verified_by_position?: string

    check_by_signature_media_id?: string
    check_by_name?: string
    check_by_position?: string

    acknowledge_by_signature_media_id?: string
    acknowledge_by_name?: string
    acknowledge_by_position?: string

    noted_by_signature_media_id?: string
    noted_by_name?: string
    noted_by_position?: string

    posted_by_signature_media_id?: string
    posted_by_name?: string
    posted_by_position?: string

    paid_by_signature_media_id?: string
    paid_by_name?: string
    paid_by_position?: string

    // Check Entry Fields
    check_entry_amount?: number
    check_entry_check_number?: string
    check_entry_check_date?: string 
    check_entry_account_id?: string

    cash_check_voucher_entries?: ICashCheckVoucherEntryRequest[] 
    cash_check_voucher_entries_deleted?: TEntityId[]
}
export type TCashCheckVoucherStatus = 'draft' | 'posted' | 'cancelled'
export enum ECashCheckVoucherStatus {
    Draft = 'draft',
    Posted = 'posted',
    Cancelled = 'cancelled',
}
export type TCashCheckVoucherPrintMode = 'print' | 'print-undo' | 'approve'
export type TCashCheckVoucherActionMode =
    | 'approve-undo'
    | 'release'
    | 'print-only'

export interface ICashCheckVoucherPaginated
    extends IPaginatedResult<ICashCheckVoucher> {}
