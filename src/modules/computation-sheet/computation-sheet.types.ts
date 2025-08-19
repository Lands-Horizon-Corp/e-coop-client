import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface IComputationSheetRequest {
    name: string
    description?: string
    deliquent_account?: boolean
    fines_account?: boolean
    interest_account_id?: boolean
    comaker_account?: number
    exist_account?: boolean
}

export interface IComputationSheetResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    name: string
    description: string
    deliquent_account: boolean
    fines_account: boolean
    interest_account_id: boolean
    comaker_account: number
    exist_account: boolean
}
