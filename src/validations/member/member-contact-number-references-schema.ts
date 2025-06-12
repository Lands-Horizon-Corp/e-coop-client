import z from 'zod'
import { entityIdSchema } from '@/validations/common'

export const memberContactReferenceSchema = z.object({
    id: entityIdSchema.optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    contactNumber: z.string().min(1, 'Contact Number is required'),
})
