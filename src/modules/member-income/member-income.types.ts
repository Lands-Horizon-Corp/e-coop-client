import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMedia } from '../media/media.types'
import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberIncomeRequest {
    media_id?: TEntityId
    name: string
    amount: number
    release_date?: string
}

export interface IMemberIncome
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    media_id?: TEntityId
    media?: IMedia
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    name: string
    amount: number
    release_date?: string
}
