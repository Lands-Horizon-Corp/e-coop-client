// THIS IS ONLY USE FOR MEMBER PROFILE UPDATE

import { TCivilStatus, TEntityId, TGeneralStatus } from '@/types/common'

// 📌 Identity & Personal Info
export interface IMemberProfilePersonalInfoRequest {
    first_name: string
    middle_name?: string
    last_name: string
    full_name?: string
    suffix?: string
    member_gender_id?: TEntityId
    birth_date?: string
    contact_number?: string

    civil_status: TCivilStatus

    occupation_id?: TEntityId

    business_address?: string
    business_contact?: string

    notes?: string
    description?: string
}

// 🏛️ Membership Info
export interface IMemberProfileMembershipInfoRequest {
    passbook?: string
    old_reference_id?: string

    status?: TGeneralStatus

    member_type_id?: TEntityId
    member_group_id?: TEntityId
    member_classification_id?: TEntityId
    member_center_id?: TEntityId

    recruited_by_member_profile_id?: TEntityId

    is_mutual_fund_member?: boolean
    is_micro_finance_member?: boolean
}

export interface IMemberProfileAccountRequest {
    user_id?: TEntityId
}

export interface IMemberProfileMediasRequest {
    media_id?: TEntityId
    signature_media_id?: TEntityId
}
