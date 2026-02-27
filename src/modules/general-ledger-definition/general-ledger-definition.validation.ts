import { z } from 'zod'

import { GENERAL_LEDGER_TYPE } from '../general-ledger/general-ledger.constants'

export const GeneralLedgerTypeEnumSchema = z.enum(GENERAL_LEDGER_TYPE)

export const GeneralLedgerDefinitionSchema = z.object({
    name: z.string().min(1, 'The name is Required!'),
    index: z.coerce.number().optional(),
    name_in_total: z.string().optional(),

    beginning_balance_of_the_year_credit: z.number().optional(),
    beginning_balance_of_the_year_debit: z.number().optional(),

    past_due: z.string().optional(),
    in_litigation: z.string().optional(),

    general_ledger_type: GeneralLedgerTypeEnumSchema,
})

export type IGeneralLedgerDefinitionFormValues = z.infer<
    typeof GeneralLedgerDefinitionSchema
>
