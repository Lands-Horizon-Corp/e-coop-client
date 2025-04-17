import z from 'zod'
import { entityIdSchema } from '@/validations/common'

export const memberIncomeSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0, 'Amount must be non-negative'),
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(1, 'Description is required'),
})
