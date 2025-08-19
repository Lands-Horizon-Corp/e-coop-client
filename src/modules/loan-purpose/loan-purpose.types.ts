import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

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
