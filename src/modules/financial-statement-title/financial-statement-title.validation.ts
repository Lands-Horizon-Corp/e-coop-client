import z from 'zod'

export const FinancialStatementTitleSchema = z.object({
    title: z.string().min(1, 'FinancialStatementTitle title is required'),
    total_title: z.string().optional(),

    exclude_consolidate_total: z.boolean().optional(),

    index: z.coerce.number(),
    color: z.string(),
})

export type TFinancialStatementTitleSchema = z.infer<
    typeof FinancialStatementTitleSchema
>
