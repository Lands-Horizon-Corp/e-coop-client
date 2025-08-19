import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { descriptionSchema, entityIdSchema } from '@/validation'

import { IAccount } from '../account'

export interface IGeneralAccountGroupingNetSurplusNegativeRequest {
    name: string
    description?: string
    account_id: TEntityId
    percentage_1?: number
    percentage_2?: number
}

export interface IGeneralAccountGroupingNetSurplusNegativeResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    account_id: TEntityId
    account?: IAccount
    name: string
    description: string
    percentage_1: number
    percentage_2: number
}

export const generalAccountGroupingNetSurplusNegativeRequestSchema = z.object({
    name: z.string().min(1).max(255),
    description: descriptionSchema.optional(),
    account_id: entityIdSchema,
    percentage_1: z.number().optional(),
    percentage_2: z.number().optional(),
})
