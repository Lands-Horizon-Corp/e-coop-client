import { IBaseEntityMeta, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IComputationSheetResponse } from '../computation-sheet'

export interface IIncludeNegativeAccount extends IBaseEntityMeta {
    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheetResponse

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
