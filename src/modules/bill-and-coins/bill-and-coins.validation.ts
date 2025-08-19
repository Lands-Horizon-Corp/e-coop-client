import z from 'zod'

export const billsAndCoinSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.coerce.number().min(0, 'Value is required'),
    country_code: z.string().min(1, 'Country code is required'),
    media_id: z.string().optional(),
    media: z.any(),
    branch_id: z.string().optional(),
    organization_id: z.string().optional(),
})

export type TBillsAndCoinFormValues = z.infer<typeof billsAndCoinSchema>
