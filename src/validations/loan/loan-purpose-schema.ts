import z from 'zod'
import { entityIdSchema } from '../common'

export const loanPurposeSchema = z.object({
    id: entityIdSchema.optional(),

    branch_id: entityIdSchema.optional(),
    organization_id: entityIdSchema.optional(),

    icon: z.string().min(1, 'Icon is required'),
    description: z.string().min(1, 'Description is required'),
})
