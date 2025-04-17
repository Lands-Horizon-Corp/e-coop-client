import z from 'zod'
import { entityIdSchema, mediaResourceSchema } from '@/validations/common'

export const memberGovernmentBenefits = z.object({
    id: entityIdSchema.optional(),
    country: z.string().min(1, 'Country is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    value: z.string().min(1, 'Value is required'),
    frontMediaId: entityIdSchema.optional(),
    frontMediaResource: mediaResourceSchema.optional(),
    backMediaResource: mediaResourceSchema.optional(),
    backMediaId: entityIdSchema.optional(),
})
