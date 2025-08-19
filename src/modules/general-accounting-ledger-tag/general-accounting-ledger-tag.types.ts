import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

export interface IGeneralLedgerTagRequest {
    general_ledger_id: TEntityId
    name: string
    description?: string
    //   category?: TagCategory;
    color?: string
    icon?: string
}

export interface IGeneralLedgerTagResponse
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    general_ledger_id: TEntityId
    general_ledger?: IGeneralLedgerTagResponse
    name: string
    description: string
    //   category: TagCategory;
    color: string
    icon: string
}
