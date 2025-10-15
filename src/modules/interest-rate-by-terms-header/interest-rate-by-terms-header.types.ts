import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMemberClassificationInterestRate } from '../member-classification-interest-rate'

export interface IInterestRateByTermsHeaderRequest {
    member_classification_interest_rate_id: TEntityId
    header_1?: number
    header_2?: number
    header_3?: number
    header_4?: number
    header_5?: number
    header_6?: number
    header_7?: number
    header_8?: number
    header_9?: number
    header_10?: number
    header_11?: number
    header_12?: number
    header_13?: number
    header_14?: number
    header_15?: number
    header_16?: number
    header_17?: number
    header_18?: number
    header_19?: number
    header_20?: number
    header_21?: number
    header_22?: number
}

export interface IInterestRateByTermsHeaderResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    member_classification_interest_rate_id: TEntityId
    member_classification_interest_rate?: IMemberClassificationInterestRate
    header_1: number
    header_2: number
    header_3: number
    header_4: number
    header_5: number
    header_6: number
    header_7: number
    header_8: number
    header_9: number
    header_10: number
    header_11: number
    header_12: number
    header_13: number
    header_14: number
    header_15: number
    header_16: number
    header_17: number
    header_18: number
    header_19: number
    header_20: number
    header_21: number
    header_22: number
}
