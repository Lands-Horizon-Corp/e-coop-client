import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '../common'

export interface ILoanStatusRequest {
    name: string
    icon?: string
    color?: string
    description?: string
}

export interface ILoanStatusResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    icon: string
    color: string
    description: string
}

export const loanStatusRequestSchema = z.object({
    name: z.string().min(1).max(255),
    icon: z.string().optional(),
    color: z.string().optional(),
    description: z.string().optional(),
})
