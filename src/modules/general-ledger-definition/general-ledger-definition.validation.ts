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

export const GLCloseBookSchema = z.object({
    year: z.coerce
        .number()
        .min(1900, 'Year is invalid')
        .max(3000, 'Year is invalid'),
})

export type IGLCloseBookFormValues = z.infer<typeof GLCloseBookSchema>

export const GLPostSchema = z.object({
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),

    is_unpost: z.boolean().optional().default(false),
})

export type IGLPostFormValues = z.infer<typeof GLPostSchema>

export const FSAccountTypeEnumSchema = z.enum([
    'standard',
    'group_title',
    'group_total',
    'sub_group_title',
    'sub_group_total',
    'header_total',
])

export const FSTitleMarginEnumSchema = z.enum([
    'indent1',
    'indent2',
    'left',
    'center',
    'left_right',
])

export const FSAccountSchema = z.object({
    account_code: z.string().min(1, 'Account code is required'),

    account_title: z.string().min(1, 'Account title is required'),

    type: FSAccountTypeEnumSchema.default('standard'),

    title_margin: FSTitleMarginEnumSchema.default('indent1'),

    exclude_consolidated: z.boolean().optional().default(false),
})

export type IFSAccountFormValues = z.infer<typeof FSAccountSchema>

export type IGeneralLedgerDefinitionFormValues = z.infer<
    typeof GeneralLedgerDefinitionSchema
>
