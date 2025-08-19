import z from 'zod'

export const disbursementSchema = z.object({
    name: z.string().min(1).max(50),
    icon: z.string().optional(),
    description: z.string().optional(),
})

export type TDisbursementFormValues = z.infer<typeof disbursementSchema>
