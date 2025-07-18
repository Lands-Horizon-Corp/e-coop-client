import { z } from 'zod'

import { FinancialStatementTypeEnum } from '@/types'

export const FinancialStatementTypeSchema = z.enum([
    FinancialStatementTypeEnum.Assets,
    FinancialStatementTypeEnum.Liabilities,
    FinancialStatementTypeEnum.Equity,
    FinancialStatementTypeEnum.Expenses,
    FinancialStatementTypeEnum.Revenue,
])

export const FinancialStatementDefinitionSchema = z.object({
    name: z.string().min(1, 'The name is Required!'),
    description: z.string().optional(),
    index: z.coerce.number().optional(),
    name_in_total: z.string().optional(),
    is_posting: z.boolean().optional(),
    financial_statement_type: FinancialStatementTypeSchema,

    beginning_balance_of_the_year_credit: z.number().optional(),
    beginning_balance_of_the_year_debit: z.number().optional(),
})

export type IFinancialStatementDefinitionFormValues = z.infer<
    typeof FinancialStatementDefinitionSchema
>
