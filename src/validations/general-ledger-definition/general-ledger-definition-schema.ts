import {
    GeneralLedgerFinancialStatementNodeType,
    GeneralLedgerTypeEnum,
} from '@/types/coop-types/general-ledger-definitions'
import { z } from 'zod'

export const GeneralLedgerTypeEnumSchema = z.enum([
    GeneralLedgerTypeEnum.Assets,
    GeneralLedgerTypeEnum.LiabilitiesEquityAndReserves,
    GeneralLedgerTypeEnum.Income,
    GeneralLedgerTypeEnum.Expenses,
])

export const GeneralLedgerFinancialStatementNodeTypeEnumSchema = z.enum([
    GeneralLedgerFinancialStatementNodeType.ACCOUNT,
    GeneralLedgerFinancialStatementNodeType.DEFINITION,
])
export const GeneralLedgerDefinitionSchema = z.object({
    name: z.string().min(1, 'The name is Required!'),
    description: z.string().optional(),
    index: z.coerce.number().optional(),
    type: GeneralLedgerFinancialStatementNodeTypeEnumSchema,
    name_in_total: z.string().optional(),
    is_posting: z.boolean().optional(),
    general_ledger_type: GeneralLedgerTypeEnumSchema,

    beginning_balance_of_the_year_credit: z.number().optional(),
    beginning_balance_of_the_year_debit: z.number().optional(),
})

export type IGeneralLedgerDefinitionFormValues = z.infer<
    typeof GeneralLedgerDefinitionSchema
>
