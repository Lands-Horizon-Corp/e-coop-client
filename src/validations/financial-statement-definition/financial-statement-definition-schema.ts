import { z } from 'zod'

export const FinancialStatementDefinitionTypesEnumSchema = z.enum([
    'Assets',
    'Liabilities',
    'Equity',
    'Revenue',
    'Expenses',
])

export const FinancialStatementDefinitionSchema = z.object({
    name: z.string().min(1, 'The name is required!'),
    description: z.string().optional(),

    exclude: z.boolean().optional(),
    index: z.coerce.number().optional(),

    name_in_total: z.string().optional(),
    is_posting: z.boolean().optional(),
    financial_statement_type: FinancialStatementDefinitionTypesEnumSchema,
})
