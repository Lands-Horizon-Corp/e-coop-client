import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'

export interface IFinesMaturityRequest {
    account_id?: TEntityId
    from: number
    to: number
    rate: number
}

export interface IFinesMaturity
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id?: TEntityId
    account?: IAccount
    from: number
    to: number
    rate: number
}
