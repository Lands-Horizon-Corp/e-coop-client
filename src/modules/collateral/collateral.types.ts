import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface ICollateralRequest {
    icon?: string
    name: string
    description?: string
}

export interface ICollateralResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    icon: string
    name: string
    description: string
}
