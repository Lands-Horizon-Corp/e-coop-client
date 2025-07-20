import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IAccount } from '../accounts/account'
import { IComputationSheet } from './computation-sheet'

export interface IIncludeNegativeAccount extends IBaseEntityMeta {
    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheet

    account_id: TEntityId
    account: IAccount

    description?: string
}

export interface IIncludeNegativeAccountRequest {
    id?: TEntityId

    computation_sheet_id: TEntityId

    account_id: TEntityId

    description?: string
}
