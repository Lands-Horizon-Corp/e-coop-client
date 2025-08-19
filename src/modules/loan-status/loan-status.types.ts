import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

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
