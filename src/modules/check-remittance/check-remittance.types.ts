import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IBank } from '../bank'
import { IMedia } from '../media/media.types'
import { ITransactionBatch } from '../transaction-batch'
import { IUser } from '../user/user.types'

export interface ICheckRemittanceRequest {
    bank_id: TEntityId
    media_id?: TEntityId
    employee_user_id?: TEntityId
    transaction_batch_id?: TEntityId
    country_code?: string
    reference_number?: string
    account_name?: string
    amount: number
    date_entry?: string
    description?: string
}

export interface ICheckRemittanceResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    bank_id: TEntityId
    bank?: IBank
    media_id?: TEntityId
    media?: IMedia
    employee_user_id?: TEntityId
    employee_user?: IUser
    transaction_batch_id?: TEntityId
    transaction_batch?: ITransactionBatch
    country_code: string
    reference_number: string
    account_name: string
    amount: number
    date_entry?: string
    description: string
}
