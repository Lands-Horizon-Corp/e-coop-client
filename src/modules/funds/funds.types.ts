import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'

export interface IFundsRequest {
    account_id?: TEntityId | null
    type: string
    description?: string
    icon?: string | null
    gl_books?: string
}

export interface IFunds extends ITimeStamps, IAuditable, IOrgBranchIdentity {
    id: TEntityId
    account_id?: TEntityId | null
    account?: IAccount
    type: string
    description: string
    icon?: string | null
    gl_books: string
}
