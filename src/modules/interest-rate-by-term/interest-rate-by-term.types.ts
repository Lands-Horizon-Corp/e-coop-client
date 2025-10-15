import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { IMemberClassificationInterestRate } from '../member-classification-interest-rate'

export interface IInterestRateByTermRequest {
    name?: string
    descrition?: string
    member_classification_interest_rate_id?: TEntityId
}

export interface IInterestRateByTerm
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    descrition: string
    member_classification_interest_rate_id: TEntityId
    member_classification_interest_rate?: IMemberClassificationInterestRate
}
