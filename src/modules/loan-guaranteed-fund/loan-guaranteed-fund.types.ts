import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface ILoanGuaranteedFundRequest {
    scheme_number: number
    increasing_rate: number
}

export interface ILoanGuaranteedFundResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    scheme_number: number
    increasing_rate: number
}
