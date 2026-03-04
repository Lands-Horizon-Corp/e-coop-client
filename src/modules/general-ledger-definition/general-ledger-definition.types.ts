import z from 'zod'

import { IBaseEntityMeta } from '@/types/common'

import { IAccount } from '../account'
import { TGeneralLedgerType } from '../general-ledger/general-ledger.types'
import { GeneralLedgerDefinitionSchema } from './general-ledger-definition.validation'

export interface IGeneralLedgerDefinition extends IBaseEntityMeta {
    general_ledger_definition_entry_id?: IGeneralLedgerDefinition

    general_ledger_definition_entries?: IGeneralLedgerDefinition[]
    accounts?: IAccount[]

    name: string
    description?: string
    index?: number
    name_in_total: string
    is_posting?: boolean
    general_ledger_type?: TGeneralLedgerType

    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number
    budget_forecasting_of_the_year_percent?: number

    past_due?: string
    in_litigation?: string

    total_debit?: number
    total_credit?: number
    balance?: number
}

export interface IGeneralLedgerDefinitionRequest extends z.infer<
    typeof GeneralLedgerDefinitionSchema
> {}
