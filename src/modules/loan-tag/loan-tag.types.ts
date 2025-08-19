import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ILoanTransaction } from '../loan-transaction'

export interface ILoanTagRequest {
    loan_transaction_id: TEntityId
    name: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export interface ILoanTagResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    name: string
    description: string
    category: string
    color: string
    icon: string
}
