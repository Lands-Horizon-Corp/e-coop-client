import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IAdjustmentEntryTag } from '../adjustment-entry-tag'
import { IMemberProfile } from '../member-profile'
import { IPaymentType } from '../payment-type'
import { IUser } from '../user'

export interface IAdjustmentEntry extends IBaseEntityMeta {
    //add here
    signature_media_id?: TEntityId
    signature_media: TEntityId

    account_id: TEntityId
    account: IAccount

    member_profile_id?: TEntityId
    member_profile?: IMemberProfile

    employee_user_id?: TEntityId
    employee_user?: IUser

    payment_type_id?: TEntityId
    payment_type?: IPaymentType

    type_of_payment_type?: string

    description?: string
    reference_number?: string
    entry_date: string

    debit: number
    credit: number

    adjustment_entry_tags: IAdjustmentEntryTag[]
}

export interface IAdjustmentEntryRequest {
    signature_media_id?: TEntityId
    account_id: TEntityId

    member_profile_id?: TEntityId
    payment_type_id?: TEntityId

    type_of_payment_type?: string

    description?: string
    reference_number?: string
    entry_date: string

    debit: number
    credit: number
}

export interface IAdjustmentEntryPaginated
    extends IPaginatedResult<IAdjustmentEntry> {}

export type TAdjustmentEntryHookMode = 'all' | 'currency' | 'currency-employee'
