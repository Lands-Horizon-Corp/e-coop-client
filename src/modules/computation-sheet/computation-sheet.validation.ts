import z from 'zod'

import { descriptionSchema } from '@/validation'

export const computationSheetSchema = z.object({
    name: z.string().min(1).max(254),
    description: descriptionSchema.optional(),
    deliquent_account: z.boolean().optional(),
    fines_account: z.boolean().optional(),
    interest_account_id: z.boolean().optional(),
    comaker_account: z.number().optional(),
    exist_account: z.boolean().optional(),
})

export type IComputationSheetFormValues = z.infer<typeof computationSheetSchema>
