import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IAccount } from '../account'
import { IComputationSheet } from '../computation-sheet'
import { BrowseExcludeIncludeAccountsSchema } from './browse-exclude-include-accounts.validation'

export interface IBrowseExcludeIncludeAccounts extends IBaseEntityMeta {
    computation_sheet_id: TEntityId
    computation_sheet: IComputationSheet

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

export type IBrowseExcludeIncludeAccountsRequest = z.infer<
    typeof BrowseExcludeIncludeAccountsSchema
>

export interface IBrowseExcludeIncludeAccountsPaginated
    extends IPaginatedResult<IBrowseExcludeIncludeAccounts> {}
