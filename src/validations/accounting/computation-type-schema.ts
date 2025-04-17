import { z } from 'zod'

export const AccountsComputationTypeRequestSchema = z.object({
    id: z.string(),
    companyId: z.string(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
})
