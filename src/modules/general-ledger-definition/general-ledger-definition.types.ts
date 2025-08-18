import { IAccount } from '../account/account.types'
import { IAuditable, ITimeStamps, TEntityId } from '../common'

export enum GeneralLedgerTypeEnum {
    Assets = 'Assets',
    LiabilitiesEquityAndReserves = 'Liabilities, Equity & Reserves',
    Income = 'Income',
    Expenses = 'Expenses',
}

export interface IGeneralLedgerDefinition extends IAuditable, ITimeStamps {
    id: TEntityId

    organization_id: TEntityId
    branch_id: TEntityId

    general_ledger_definition_entries_id?: TEntityId

    parent_id?: TEntityId
    parent?: IGeneralLedgerDefinition
    accounts?: IAccount[]
    general_ledger_definition?: IGeneralLedgerDefinition[]
    general_ledger_accounts_grouping_id: TEntityId

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
    name: string
    general_ledger_type: GeneralLedgerTypeEnum

    description?: string
    index?: number
    name_in_total?: string
    is_posting?: boolean
    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number

    general_ledger_definition_entries_id?: TEntityId
    general_ledger_accounts_grouping_id: TEntityId
}
