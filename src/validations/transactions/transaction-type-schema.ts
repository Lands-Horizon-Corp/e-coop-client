import { z } from 'zod'

export const TransactionTypeRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    chequeId: z.string().min(1, 'Cheque ID is required'),
})
