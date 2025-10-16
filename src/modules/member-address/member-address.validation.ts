import z from 'zod'

import { entityIdSchema } from '@/validation'

export const MemberAddressSchema = z.object({
    id: z.string().optional(),
    member_profile_id: entityIdSchema,
    label: z.string().min(1, 'Label is required'),
    country_code: z.string().min(1, 'Country code is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    province_state: z.string().optional(),
    barangay: z.string().optional(),
    landmark: z.string().optional(),

    longitude: z.number().optional(),
    latitude: z.number().optional(),
})
