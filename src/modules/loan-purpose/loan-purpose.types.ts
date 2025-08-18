import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '../common'

export interface ILoanPurposeRequest {
    description?: string
    icon?: string
}

export interface ILoanPurposeResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    description: string
    icon: string
}

export const loanPurposeRequestSchema = z.object({
    description: z.string().optional(),
    icon: z.string().optional(),
})
