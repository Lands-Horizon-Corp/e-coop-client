import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { ILoanTransaction } from '../loan-transaction'

export interface ILoanClearanceAnalysisInstitutionRequest {
    loan_transaction_id: TEntityId
    name: string
    description?: string
}

export interface ILoanClearanceAnalysisInstitutionResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    name: string
    description: string
}
