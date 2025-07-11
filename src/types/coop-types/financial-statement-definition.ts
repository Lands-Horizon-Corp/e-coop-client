import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IAccount } from './accounts/account'

export enum FinancialStatementTypeEnum {
    Assets = 'Assets',
    Liabilities = 'Liabilities',
    Equity = 'Equity',
    Revenue = 'Revenue',
    Expenses = 'Expenses',
}

export interface IFinancialStatementDefinition extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    financial_statement_definition_id?: TEntityId
    financial_statement_grouping_id?: TEntityId

    name: string
    index?: number
    exclude?: boolean
    description?: string

    parent_id?: TEntityId
    parent?: IFinancialStatementDefinition
    financial_statement_definition: IFinancialStatementDefinition[]
    accounts: IAccount[]

    name_in_total?: string
    is_posting?: boolean
    financial_statement_type?: FinancialStatementTypeEnum
}

export interface IFinancialStatementDefinitionRequest {
    name: string
    financial_statement_type?: FinancialStatementTypeEnum

    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number

    financial_statement_definition_entries_id?: TEntityId
    financial_statement_accounts_grouping_id?: TEntityId
}

export interface IFinancialStatementDefinitionNode
    extends IFinancialStatementDefinition {
    children?: IFinancialStatementDefinitionNode[]
}

export type FinancialStatementTree = IFinancialStatementDefinitionNode[]
