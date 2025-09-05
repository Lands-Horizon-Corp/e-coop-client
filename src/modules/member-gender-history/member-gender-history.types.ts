import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types/common'

import { IMemberGender } from '../member-gender/member-gender.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberGenderHistoryRequest {
    member_profile_id: TEntityId
    member_gender_id: TEntityId
}

export interface IMemberGenderHistory extends IBaseEntityMeta {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    member_gender_id: TEntityId
    member_gender?: IMemberGender
}

export interface IMemberGenderHistoryPaginated
    extends IPaginatedResult<IMemberGenderHistory> {}
