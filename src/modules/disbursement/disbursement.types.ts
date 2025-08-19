import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

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
