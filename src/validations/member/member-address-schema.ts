import z from 'zod'
import { entityIdSchema } from '@/validations/common'

export const memberAddressSchema = z.object({
    id: entityIdSchema.optional(),
    postalCode: z.string().min(1, 'Postal Code is required'),
    province: z.string().min(1, 'Province is required'),
    city: z.string().min(1, 'City is required'),
    barangay: z.string().min(1, 'Barangay is required'),
    label: z.string().min(1, 'Label is required'),
})
