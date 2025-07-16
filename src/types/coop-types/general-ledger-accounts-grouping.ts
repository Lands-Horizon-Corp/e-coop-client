import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IGeneralLedgerDefinition } from './general-ledger-definitions'
import { IPaginatedResult } from './paginated-result'

export type AccountingPrincipleType = 'positive' | 'negative'

export interface IGeneralLedgerAccountsGrouping
    extends IAuditable,
        ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType
    name: string
    description: string
    general_ledger_definition: IGeneralLedgerDefinition[]

    from_code?: number
    to_code?: number
}

export interface IGeneralLedgerAccountsGroupingRequest {
    name: string
    description?: string

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType

    from_code?: number
    to_code?: number
}

export interface IPaginatedGeneralLedgerAccountsGroupingRequest
    extends IPaginatedResult<IGeneralLedgerAccountsGrouping> {}
