import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ILoanTransaction } from '../loan-transaction'

export interface ILoanTermsAndConditionSuggestedPaymentRequest {
    loan_transaction_id: TEntityId
}

export interface ILoanTermsAndConditionSuggestedPaymentResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
}
