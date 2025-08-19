import z from 'zod'

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

export const loanGuaranteedFundRequestSchema = z.object({
    scheme_number: z.number(),
    increasing_rate: z.number(),
})
