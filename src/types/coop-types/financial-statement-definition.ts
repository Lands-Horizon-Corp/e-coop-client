import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { GeneralLedgerFinancialStatementNodeType } from './general-ledger-definitions'
import { IPaginatedResult } from './paginated-result'

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

    type: GeneralLedgerFinancialStatementNodeType
    name: string
    index?: number
    exclude?: boolean
    description?: string

    parent_id?: TEntityId
    parent?: IFinancialStatementDefinition
    financial_statement_accounts: IFinancialStatementDefinition[]

    name_in_total?: string
    is_posting?: boolean
    financial_statement_type?: FinancialStatementTypeEnum
}

export interface IFinancialStatementDefinitionRequest {
    name: string

    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    financial_statement_type?: FinancialStatementTypeEnum
    exclude: boolean

    organization_id?: TEntityId
    branch_id?: TEntityId
    financial_statement_definition_id?: TEntityId
}

export interface IPaginatedFinancialStatementDefinitionResource
    extends IPaginatedResult<IFinancialStatementDefinition> {}

export interface IFinancialStatementDefinitionNode
    extends IFinancialStatementDefinition {
    children?: IFinancialStatementDefinitionNode[]
}

export type FinancialStatementTree = IFinancialStatementDefinitionNode[]
