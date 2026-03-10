import { z } from 'zod'

import { entityIdSchema } from '@/validation'

import { GENERAL_LEDGER_TYPE } from '../general-ledger/general-ledger.constants'

export const GeneralLedgerTypeEnumSchema = z.enum(GENERAL_LEDGER_TYPE)

export const GeneralLedgerDefinitionSchema = z.object({
    general_ledger_definition_entry_id: entityIdSchema.optional(),

    name: z.string().min(1, 'The name is Required!'),
    description: z.string().optional(),
    index: z.coerce.number().optional(),
    name_in_total: z.string().min(1, 'Name in total is required'),

    is_posting: z.boolean().optional().default(false),
    general_ledger_type: GeneralLedgerTypeEnumSchema,

    beginning_balance_of_the_year_credit: z.coerce.number().optional(),
    beginning_balance_of_the_year_debit: z.coerce.number().optional(),
    budget_forecasting_of_the_year_percent: z.coerce.number().optional(),

    past_due: z.string().optional(),
    in_litigation: z.string().optional(),
})

export type IGeneralLedgerDefinitionFormValues = z.infer<
    typeof GeneralLedgerDefinitionSchema
>
