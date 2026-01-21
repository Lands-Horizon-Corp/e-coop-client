import { IAuditable, ITimeStamps, TEntityId } from '@/types'

import { IFinancialStatementDefinition } from '../financial-statement-definition'

export interface IFinancialStatementAccountGrouping
    extends IAuditable,
        ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    debit: number
    credit: number
    name: string
    description: string
    financial_statement_definition_entries: IFinancialStatementDefinition[]

    from_code?: number
    to_code?: number
}

export interface IFinancialStatementAccountGroupingRequest {
    debit?: number
    credit?: number

    name: string
    description?: string
}
