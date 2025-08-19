import z from 'zod'

import {
    IAuditable,
    ITimeStamps,
    TEntityId,
    entityIdSchema,
} from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'

export interface IMemberAddress extends ITimeStamps, IAuditable {
    id: TEntityId
    member_profile_id: TEntityId
    member_profile: IMemberProfile

    label: string
    address: string
    country_code: string

    city?: string
    postal_code?: string
    province_state?: string
    barangay?: string
    landmark?: string
}

// LATEST FROM ERD
export interface IMemberAddressRequest {
    id?: TEntityId
    member_profile_id: TEntityId

    label: string
    address: string
    country_code: string

    city?: string
    postal_code?: string
    province_state?: string
    barangay?: string // Optional, specific to some countries
    landmark?: string // Optional, for additional directions
}

export const memberAddressSchema = z.object({
    id: entityIdSchema.optional(),
    postalCode: z.string().min(1, 'Postal Code is required'),
    province: z.string().min(1, 'Province is required'),
    city: z.string().min(1, 'City is required'),
    barangay: z.string().min(1, 'Barangay is required'),
    label: z.string().min(1, 'Label is required'),
})
