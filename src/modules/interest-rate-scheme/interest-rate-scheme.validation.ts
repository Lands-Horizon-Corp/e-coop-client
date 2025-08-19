import z from 'zod'

export const interestRateSchemeSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
})

export type TInterestRateSchemeFormValues = z.infer<
    typeof interestRateSchemeSchema
>
