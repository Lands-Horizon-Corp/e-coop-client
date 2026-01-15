import { IAuditable, ITimeStamps, TEntityId } from '@/types'

import { IAccount } from '../account'
import { FINANCIAL_STATEMENT_TYPE } from './financial-statement-definition.constants'
import { IFinancialStatementDefinitionSchema } from './financial-statement-definition.validation'

export type TFinancialStatementType = (typeof FINANCIAL_STATEMENT_TYPE)[number]

export interface IFinancialStatementDefinition extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    financial_statement_definition_entries_id?: TEntityId

    accounts?: IAccount[]
    financial_statement_definition_entries?: IFinancialStatementDefinition[]
    financial_statement_accounts_grouping_id: TEntityId

    name: string
    description?: string
    index?: number

    name_in_total?: string
    is_posting?: boolean
    financial_statement_type: TFinancialStatementType

    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number
}

export type IFinancialStatementDefinitionRequest =
    IFinancialStatementDefinitionSchema
