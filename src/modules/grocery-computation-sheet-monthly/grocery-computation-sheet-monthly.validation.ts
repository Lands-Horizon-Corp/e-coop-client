import z from 'zod'

import { entityIdSchema } from '@/validation'

export const groceryComputationSheetMonthlySchema = z.object({
    grocery_computation_sheet_id: entityIdSchema,
    months: z.number().optional(),
    interest_rate: z.number().optional(),
    loan_guaranteed_fund_rate: z.number().optional(),
})
export type IGroceryComputationSheetMonthlyFormValues = z.infer<
    typeof groceryComputationSheetMonthlySchema
>
