import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile'
import { IUser } from '../user/user.types'

export interface IJournalVoucherRequest {
    employee_user_id?: TEntityId | null
    member_profile_id?: TEntityId | null
    printed_by_user_id?: TEntityId | null
    approved_by_user_id?: TEntityId | null
    released_by_user_id?: TEntityId | null
    total_debit?: number
    total_credit?: number
    print_count?: number
    description?: string
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
    approved_by_signature_media_id?: TEntityId | null
    approved_by_name?: string
    approved_by_position?: string
    prepared_by_signature_media_id?: TEntityId | null
    prepared_by_name?: string
    prepared_by_position?: string
    certified_by_signature_media_id?: TEntityId | null
    certified_by_name?: string
    certified_by_position?: string
    verified_by_signature_media_id?: TEntityId | null
    verified_by_name?: string
    verified_by_position?: string
    check_by_signature_media_id?: TEntityId | null
    check_by_name?: string
    check_by_position?: string
    acknowledge_by_signature_media_id?: TEntityId | null
    acknowledge_by_name?: string
    acknowledge_by_position?: string
    noted_by_signature_media_id?: TEntityId | null
    noted_by_name?: string
    noted_by_position?: string
    posted_by_signature_media_id?: TEntityId | null
    posted_by_name?: string
    posted_by_position?: string
    paid_by_signature_media_id?: TEntityId | null
    paid_by_name?: string
    paid_by_position?: string
}

export interface IJournalVoucherResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    employee_user_id?: TEntityId | null
    employee_user?: IUser
    member_profile_id?: TEntityId | null
    member_profile?: IMemberProfile
    printed_by_user_id?: TEntityId | null
    printed_by_user?: IUser
    approved_by_user_id?: TEntityId | null
    approved_by_user?: IUser
    released_by_user_id?: TEntityId | null
    released_by_user?: IUser
    total_debit: number
    total_credit: number
    print_count: number
    description: string
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
    approved_by_signature_media_id?: TEntityId | null
    approved_by_signature_media?: IMedia
    approved_by_name: string
    approved_by_position: string
    prepared_by_signature_media_id?: TEntityId | null
    prepared_by_signature_media?: IMedia
    prepared_by_name: string
    prepared_by_position: string
    certified_by_signature_media_id?: TEntityId | null
    certified_by_signature_media?: IMedia
    certified_by_name: string
    certified_by_position: string
    verified_by_signature_media_id?: TEntityId | null
    verified_by_signature_media?: IMedia
    verified_by_name: string
    verified_by_position: string
    check_by_signature_media_id?: TEntityId | null
    check_by_signature_media?: IMedia
    check_by_name: string
    check_by_position: string
    acknowledge_by_signature_media_id?: TEntityId | null
    acknowledge_by_signature_media?: IMedia
    acknowledge_by_name: string
    acknowledge_by_position: string
    noted_by_signature_media_id?: TEntityId | null
    noted_by_signature_media?: IMedia
    noted_by_name: string
    noted_by_position: string
    posted_by_signature_media_id?: TEntityId | null
    posted_by_signature_media?: IMedia
    posted_by_name: string
    posted_by_position: string
    paid_by_signature_media_id?: TEntityId | null
    paid_by_signature_media?: IMedia
    paid_by_name: string
    paid_by_position: string
}
