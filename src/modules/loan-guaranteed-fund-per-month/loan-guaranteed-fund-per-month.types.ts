import z from 'zod'

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

export interface ILoanGuaranteedFundPerMonthResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    month: number
    loan_guaranteed_fund: number
}

export const loanGuaranteedFundPerMonthRequestSchema = z.object({
    month: z.number().optional(),
    loan_guaranteed_fund: z.number().optional(),
})
