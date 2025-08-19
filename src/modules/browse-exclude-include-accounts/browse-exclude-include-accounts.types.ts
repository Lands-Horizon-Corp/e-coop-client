import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IAccount } from '../account/account.types'
import { IComputationSheetResponse } from '../computation-sheet'

export interface IBrowseExcludeIncludeAccounts extends IBaseEntityMeta {
    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheetResponse

    fines_account_id: TEntityId
    fines_account: IAccount

    comaker_account_id: TEntityId
    comaker_account: IAccount

    interest_account_id: TEntityId
    interest_account: IAccount

    deliquent_account_id: TEntityId
    deliquent_account: IAccount

    include_existing_loan_account_id: TEntityId
    include_existing_loan_account: IAccount
}

export interface IBrowseExcludeIncludeAccountsRequest {
    id?: TEntityId

    computation_sheet_id?: TEntityId
    fines_account_id?: TEntityId
    comaker_account_id?: TEntityId
    interest_account_id?: TEntityId
    deliquent_account_id?: TEntityId
    include_existing_loan_account_id?: TEntityId
}
