import { IBaseEntityMeta } from '@/types/common'

import { IMedia } from '../media/media.types'
import { IUserBase } from '../user/user.types'

export interface ICashCheckVoucherResponse extends IBaseEntityMeta {
    id: string

    employee_user_id?: string
    employee_user?: IUserBase

    transaction_batch_id?: string
    //   transaction_batch?: ITransact;

    printed_by_user_id?: string
    printed_by_user?: IUserBase

    approved_by_user_id?: string
    approved_by_user?: IUserBase

    released_by_user_id?: string
    released_by_user?: IUserBase

    pay_to: string

    status: string
    description: string
    cash_voucher_number: string
    total_debit: number
    total_credit: number
    print_count: number
    printed_date?: string
    approved_date?: string
    released_date?: string

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
}

export interface ICashCheckVoucherRequest {
    employee_user_id?: string
    transaction_batch_id?: string
    printed_by_user_id?: string
    approved_by_user_id?: string
    released_by_user_id?: string

    pay_to?: string
    status?: string
    description?: string
    cash_voucher_number?: string
    total_debit?: number
    total_credit?: number
    print_count?: number
    printed_date?: string
    approved_date?: string
    released_date?: string

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
}
