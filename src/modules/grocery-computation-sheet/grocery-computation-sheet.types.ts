import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface IGroceryComputationSheetRequest {
    scheme_number: number
    description?: string
}

export interface IGroceryComputationSheetResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    scheme_number: number
    description: string
}
