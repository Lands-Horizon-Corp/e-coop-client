import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface ILoanGuaranteedFundPerMonthRequest {
    month?: number
    loan_guaranteed_fund?: number
}

export interface ILoanGuaranteedFundPerMonth
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    month: number
    loan_guaranteed_fund: number
}
