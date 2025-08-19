import { IAuditable, ITimeStamps, TEntityId } from '@/types'

import { IFinancialStatementDefinition } from '../financial-statement-definition'
import { AccountingPrincipleType } from '../general-ledger-accounts-grouping'

export interface IFinancialStatementAccountGrouping
    extends IAuditable,
        ITimeStamps {
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

export interface IFinancialStatementAccountGroupingRequest {
    debit: AccountingPrincipleType
    credit: AccountingPrincipleType

    name: string
    description?: string

    from_code?: number
    to_code?: number

    branch_id: TEntityId
    organization_id: TEntityId
}
