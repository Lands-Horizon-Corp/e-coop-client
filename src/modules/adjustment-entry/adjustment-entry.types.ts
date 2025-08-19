import { IBaseEntityMeta, ITimeStamps } from '@/types/common'

import { IAccount } from '../account'
import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile'
import { IPaymentType } from '../payment-type/payment-type.types'
import { IUserBase } from '../user/user.types'

export interface IAdjustmentEntry extends IBaseEntityMeta {
    id: string
    signature_media_id?: string
    signature_media?: IMedia
    account_id: string
    account?: IAccount
    member_profile_id?: string
    member_profile?: IMemberProfile
    employee_user_id?: string
    employee_user?: IUserBase
    payment_type_id?: string
    payment_type?: IPaymentType
    type_of_payment_type: string
    description: string
    reference_number: string
    entry_date?: string
    debit: number
    credit: number
}

export interface IAdjustmentEntryRequest {
    signature_media_id?: string
    account_id: string
    member_profile_id?: string
    employee_user_id?: string
    payment_type_id?: string
    type_of_payment_type?: string
    description?: string
    reference_number?: string
    entry_date?: string
    debit?: number
    credit?: number
}

export type IAdjustmentEntryResponse = IAdjustmentEntry & ITimeStamps
