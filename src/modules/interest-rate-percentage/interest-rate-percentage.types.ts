import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberClassificationInterestRateResponse } from '../member-classification-interest-rate'

export interface IInterestRatePercentageRequest {
    name?: string
    description?: string
    months?: number
    interest_rate?: number
    member_classification_interest_rate_id?: TEntityId
}

export interface IInterestRatePercentageResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    description: string
    months: number
    interest_rate: number
    member_classification_interest_rate_id: TEntityId
    member_classification_interest_rate?: IMemberClassificationInterestRateResponse
}

export const interestRatePercentageRequestSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    months: z.number().optional(),
    interest_rate: z.number().optional(),
    member_classification_interest_rate_id: entityIdSchema.optional(),
})
