import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IAccount } from '../account'
import { ILoanTransaction } from '../loan-transaction'

export interface ILoanTermsAndConditionAmountReceiptRequest {
    loan_transaction_id: TEntityId
    account_id: TEntityId
    amount?: number
}

export interface ILoanTermsAndConditionAmountReceiptResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    account_id: TEntityId
    account?: IAccount
    amount: number
}
