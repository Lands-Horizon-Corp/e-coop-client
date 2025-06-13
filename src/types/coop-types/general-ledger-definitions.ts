import { IAuditable, ITimeStamps, TEntityId } from '../common'
import { IPaginatedResult } from './paginated-result'

export enum GeneralLedgerTypeEnum {
    Assets = 'Assets',
    LiabilitiesEquityAndReserves = 'Liabilities, Equity & Reserves',
    Income = 'Income',
    Expenses = 'Expenses',
}

export enum GeneralLedgerFinancialStatementNodeType {
    DEFINITION = 'DEFINITION',
    ACCOUNT = 'ACCOUNT',
}

export interface IGeneralLedgerDefinition extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    general_ledger_definition_entries_id?: TEntityId

    type: GeneralLedgerFinancialStatementNodeType
    parent_id?: TEntityId
    parent?: IGeneralLedgerDefinition
    general_ledger_accounts: IGeneralLedgerDefinition[]

    name: string
    description?: string
    index?: number

    name_in_total?: string
    is_posting?: boolean
    general_ledger_type: GeneralLedgerTypeEnum

    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number
}

export interface IGeneralLedgerDefinitionRequest {
    organization_id: TEntityId
    branch_id: TEntityId
    name: string
    general_ledger_type: GeneralLedgerTypeEnum

    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number

    general_ledger_definition_entries_id?: TEntityId

    general_ledger_accounts_grouping_id?: TEntityId
}

export interface IPaginatedGeneralLedgerDefinition
    extends IPaginatedResult<IGeneralLedgerDefinition> {}

export interface IGeneralLedgerDefinition {
    id: TEntityId
    organization_id: TEntityId
    branch_id: TEntityId

    general_ledger_definition_entries_id?: TEntityId

    type: GeneralLedgerFinancialStatementNodeType
    parent_id?: TEntityId
    parent?: IGeneralLedgerDefinition // Optional, leaving undefined for simplicity in sample
    general_ledger_accounts: IGeneralLedgerDefinition[]

    name: string
    description?: string
    index?: number

    name_in_total?: string
    is_posting?: boolean
    general_ledger_type: GeneralLedgerTypeEnum

    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number

    created_at: string
    updated_at?: string
}
