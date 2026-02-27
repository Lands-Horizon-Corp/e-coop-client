import z from 'zod'

import { IBaseEntityMeta } from '@/types/common'

import { TGeneralLedgerType } from '../general-ledger/general-ledger.types'
import { GeneralLedgerDefinitionSchema } from './general-ledger-definition.validation'

export interface IGeneralLedgerDefinition extends IBaseEntityMeta {
    name: string
    name_in_total?: string
    index?: number

    beginning_balance_of_the_year_credit?: number
    beginning_balance_of_the_year_debit?: number
    budget_forecasting_of_the_year_percent?: number

    past_due?: string
    in_litigation?: string
    general_ledger_type: TGeneralLedgerType

    total_debit: number
    total_credit: number
    balance: number
}
export interface IGeneralLedgerDefinitionRequest extends z.infer<
    typeof GeneralLedgerDefinitionSchema
> {}
