import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IFinancialStatementDefinition } from './financial-statement-definition'
import { AccountingPrincipleType } from './general-ledger-accounts-grouping'
import { IPaginatedResult } from './paginated-result'

export interface FinancialStatementGrouping extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    debit: AccountingPrincipleType
    credit: AccountingPrincipleType
    name: string
    description: string
    financial_statement_definition_entries: IFinancialStatementDefinition[]

    from_code?: number
    to_code?: number
}

export interface IPaginatedFinancialStatementAccountsGroupingResource
    extends IPaginatedResult<FinancialStatementGrouping> {}
