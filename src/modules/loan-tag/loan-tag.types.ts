import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { ILoanTransaction } from '../loan-transaction'

export interface ILoanTagRequest {
    loan_transaction_id: TEntityId
    name: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

export interface ILoanTagResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    loan_transaction_id: TEntityId
    loan_transaction?: ILoanTransaction
    name: string
    description: string
    category: string
    color: string
    icon: string
}

export const loanTagRequestSchema = z.object({
    loan_transaction_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: z.string().optional(),
    category: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
})
