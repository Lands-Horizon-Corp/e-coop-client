import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ILoanTransaction } from '../loan-transaction'
import { IMemberProfile } from '../member-profile'

export interface ILoanComakerMemberRequest {
    member_profile_id: TEntityId
    loan_transaction_id: TEntityId
    description?: string
    amount?: number
    months_count?: number
    year_count?: number
}

export interface ILoanComakerMemberResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile?: IMemberProfile
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    description: string
    amount: number
    months_count: number
    year_count: number
}
