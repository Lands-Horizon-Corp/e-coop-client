import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IMemberProfile } from '../member-profile/member-profile.types'
import { MemberAddressSchema } from './member-address.validation'

export interface IMemberAddress extends IBaseEntityMeta {
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
export type IMemberAddressRequest = z.infer<typeof MemberAddressSchema>
