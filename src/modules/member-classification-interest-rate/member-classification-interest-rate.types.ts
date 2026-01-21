import z from 'zod'

import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'
import { entityIdSchema } from '@/validation'

import { IInterestRateByTermsHeaderResponse } from '../interest-rate-by-terms-header'
import { IInterestRateScheme } from '../interest-rate-scheme'
import { IMemberClassification } from '../member-classification/member-classification.types'

export interface IMemberClassificationInterestRateRequest {
    name: string
    description?: string
    interest_rate_scheme_id?: TEntityId
    member_classification_id?: TEntityId
    interest_rate_by_terms_header_id?: TEntityId
}

export interface IMemberClassificationInterestRate
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    description: string
    interest_rate_scheme_id?: TEntityId
    interest_rate_scheme?: IInterestRateScheme
    member_classification_id?: TEntityId
    member_classification?: IMemberClassification
    interest_rate_by_terms_header_id?: TEntityId
    interest_rate_by_terms_header?: IInterestRateByTermsHeaderResponse
}

export const memberClassificationInterestRateRequestSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    interest_rate_scheme_id: entityIdSchema.optional(),
    member_classification_id: entityIdSchema.optional(),
    interest_rate_by_terms_header_id: entityIdSchema.optional(),
})
