import z from 'zod'

import { entityIdSchema } from '@/validation'

import { HOME_TYPES } from './member-address.constants'

export const HomeTypeSchema = z.enum(HOME_TYPES, 'Invalid home type')

export const MemberAddressSchema = z.object({
    id: z.string().optional(),

    // member_profile_id: entityIdSchema.optional(),

    label: HomeTypeSchema,
    country_code: z.string().min(1, 'Country code is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    province_state: z.string().optional(),
    barangay: z.string().optional(),
    landmark: z.string().optional(),

    aareaId: entityIdSchema.optional(),
    area: z.any().optional(),

    longitude: z.number().optional(),
    latitude: z.number().optional(),
})
