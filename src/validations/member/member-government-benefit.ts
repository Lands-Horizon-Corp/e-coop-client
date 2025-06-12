import z from 'zod'
import { entityIdSchema, mediaSchema } from '@/validations/common'

export const memberGovernmentBenefitSchema = z.object({
    id: entityIdSchema.optional(),
    country: z.string().min(1, 'Country is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    value: z.string().min(1, 'Value is required'),
    frontMediaId: entityIdSchema.optional(),
    frontMediaResource: mediaSchema.optional(),
    backMediaResource: mediaSchema.optional(),
    backMediaId: entityIdSchema.optional(),
})
