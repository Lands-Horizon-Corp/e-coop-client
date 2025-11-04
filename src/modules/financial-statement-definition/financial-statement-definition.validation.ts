import { z } from 'zod'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
    entityIdSchema,
} from '@/validation'

import { FINANCIAL_STATEMENT_TYPE } from './financial-statement-definition.constants'

export const FinancialStatementTypeSchema = z.enum(FINANCIAL_STATEMENT_TYPE)

export const FinancialStatementDefinitionSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'The name is Required!'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    index: z.coerce.number().optional(),
    name_in_total: z.string().optional(),
    is_posting: z.boolean().optional(),
    financial_statement_type: FinancialStatementTypeSchema,

    beginning_balance_of_the_year_credit: z.number().optional(),
    beginning_balance_of_the_year_debit: z.number().optional(),

    financial_statement_definition_entries_id: entityIdSchema.optional(),
})

export type IFinancialStatementDefinitionSchema = z.infer<
    typeof FinancialStatementDefinitionSchema
>
