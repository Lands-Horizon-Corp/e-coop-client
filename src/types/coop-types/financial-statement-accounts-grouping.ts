import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { AccountingPrincipleType } from './general-ledger-accounts-grouping'
import { IPaginatedResult } from './paginated-result'

export interface IFinancialStatementAccountsGrouping
    extends IAuditable,
        ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    icon_media_id?: TEntityId

    name: string
    description: string

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType

    code: number
}

export interface IFinancialStatementAccountsGroupingRequest {
    name: string
    description: string

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType

    code: number

    organization_id?: TEntityId
    branch_id?: TEntityId
    icon_media_id?: TEntityId
}

export interface IPaginatedFinancialStatementAccountsGroupingResource
    extends IPaginatedResult<IFinancialStatementAccountsGrouping> {}
