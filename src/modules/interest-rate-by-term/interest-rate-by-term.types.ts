import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberClassificationInterestRateResponse } from '../member-classification-interest-rate'

export interface IInterestRateByTermRequest {
    name?: string
    descrition?: string
    member_classification_interest_rate_id?: TEntityId
}

export interface IInterestRateByTermResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    descrition: string
    member_classification_interest_rate_id: TEntityId
    member_classification_interest_rate?: IMemberClassificationInterestRateResponse
}

export const interestRateByTermRequestSchema = z.object({
    name: z.string().optional(),
    descrition: z.string().optional(),
    member_classification_interest_rate_id: entityIdSchema.optional(),
})
