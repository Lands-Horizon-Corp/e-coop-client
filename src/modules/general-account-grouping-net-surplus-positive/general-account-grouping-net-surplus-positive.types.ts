import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'

export interface IGeneralAccountGroupingNetSurplusPositiveRequest {
    name: string
    description?: string
    account_id: TEntityId
    percentage_1?: number
    percentage_2?: number
}

export interface IGeneralAccountGroupingNetSurplusPositive
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id: TEntityId
    account?: IAccount
    name: string
    description: string
    percentage_1: number
    percentage_2: number
}
