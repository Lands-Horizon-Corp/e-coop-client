import { z } from 'zod'

import { descriptionSchema, entityIdSchema } from '@/validation'

const AccountingPrinciple = z.enum([
    'asset',
    'liability',
    'equity',
    'income',
    'expense',
])
export const financialStatementGroupingSchema = z.object({
    organization_id: entityIdSchema,
    branch_id: entityIdSchema,
    name: z.string().min(1).max(50),
    description: descriptionSchema,
    debit: AccountingPrinciple,
    credit: AccountingPrinciple,
    code: z.number(),
    icon_media_id: entityIdSchema.optional().nullable(),
})
export type TFinancialStatementGroupingFormValues = z.infer<
    typeof financialStatementGroupingSchema
>
