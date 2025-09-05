import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'

export interface IInterestMaturityRequest {
    account_id?: TEntityId | null
    from: number
    to: number
    rate: number
}

export interface IInterestMaturityResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id?: TEntityId | null
    account?: IAccount
    from: number
    to: number
    rate: number
}
