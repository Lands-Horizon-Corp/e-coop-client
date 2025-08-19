import z from 'zod'

export const groceryComputationSheetSchema = z.object({
    scheme_number: z.number(),
    description: z.string().optional(),
})

export type IGroceryComputationSheetRequestFormValues = z.infer<
    typeof groceryComputationSheetSchema
>
