import { IAuditable, ITimeStamps, TEntityId } from '@/types/common'

import { IMemberProfile } from '../member-profile'

export interface IMemberDescriptionRequest {
    id?: TEntityId
    name: string
    description: string
}

export interface IMemberDescription extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    date: string
    description: string
    name: string
}
