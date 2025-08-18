import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '../common'
import { IMemberGender } from '../member-gender/member-gender.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberGenderHistoryRequest {
    member_profile_id: TEntityId
    member_gender_id: TEntityId
}

export interface IMemberGenderHistoryResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    member_gender_id: TEntityId
    member_gender?: IMemberGender
}

export const memberGenderHistoryRequestSchema = z.object({
    member_profile_id: entityIdSchema,
    member_gender_id: entityIdSchema,
})
