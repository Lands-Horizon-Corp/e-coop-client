import {
    IAuditable,
    IOrgBranchIdentity,
    ITimeStamps,
    TEntityId,
} from '@/types/common'

import { TTagCategory } from '../tag-template'

export interface IGeneralLedgerTagRequest {
    general_ledger_id: TEntityId
    name: string
    description?: string
    category?: TTagCategory
    color?: string
    icon?: string
}

export interface IGeneralLedgerTag
    extends ITimeStamps,
        IAuditable,
        IOrgBranchIdentity {
    id: TEntityId
    general_ledger_id: TEntityId
    general_ledger?: IGeneralLedgerTag
    name: string
    description: string
    category: TTagCategory
    color: string
    icon: string
}
