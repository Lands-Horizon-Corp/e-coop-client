import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { ITransactionResponse } from '../transaction'
import { IUser } from '../user/user.types'

export interface IDisbursementRequest {
    name: string
    icon?: string
    description?: string
}

export interface IDisbursementResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    icon: string
    description: string
}

export const disbursementRequestSchema = z.object({
    name: z.string().min(1).max(50),
    icon: z.string().optional(),
    description: z.string().optional(),
})

export interface IDisbursementTransactionRequest {
    organization_id: TEntityId
    branch_id: TEntityId
    disbursement_id: TEntityId
    transaction_batch_id: TEntityId
    employee_user_id: TEntityId
    transaction_reference_number?: string
    reference_number?: string
    amount?: number
}

export interface IDisbursementTransactionResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    disbursement_id: TEntityId
    disbursement?: IDisbursementResponse
    transaction_batch_id: TEntityId
    transaction_batch?: ITransactionResponse
    employee_user_id: TEntityId
    employee_user?: IUser
    transaction_reference_number: string
    reference_number: string
    amount: number
}

export const disbursementTransactionRequestSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    disbursement_id: entityIdSchema,
    transaction_batch_id: entityIdSchema,
    employee_user_id: entityIdSchema,
    transaction_reference_number: z.string().optional(),
    reference_number: z.string().optional(),
    amount: z.number().optional(),
})
