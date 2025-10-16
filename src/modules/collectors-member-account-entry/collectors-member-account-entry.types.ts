import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'
import { IMemberProfile } from '../member-profile'
import { IUser } from '../user/user.types'

export interface ICollectorsMemberAccountEntryRequest {
    collector_user_id?: TEntityId
    member_profile_id?: TEntityId
    account_id?: TEntityId
    description?: string
}

export interface ICollectorsMemberAccountEntry
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    collector_user_id?: TEntityId
    collector_user?: IUser
    member_profile_id?: TEntityId
    member_profile?: IMemberProfile
    account_id?: TEntityId
    account?: IAccount
    description: string
}
