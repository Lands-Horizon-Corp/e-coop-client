import z from 'zod'

import { IBaseEntityMeta, TEntityId } from '@/types/common'

import { IArea } from '../area'
// import { IMemberProfile } from '../member-profile/member-profile.types'
import { HOME_TYPES } from './member-address.constants'
import { MemberAddressSchema } from './member-address.validation'

export interface IMemberAddress extends IBaseEntityMeta {
    id: TEntityId

    // member_profile_id: TEntityId
    // member_profile: IMemberProfile

    label: THomeType
    address: string
    country_code: string

    city?: string
    postal_code?: string
    province_state?: string
    barangay?: string
    landmark?: string

    aareaId?: TEntityId
    area?: IArea

    longitude?: number
    latitude?: number
}

export type THomeType = (typeof HOME_TYPES)[number]

// LATEST FROM ERD
export type IMemberAddressRequest = z.infer<typeof MemberAddressSchema>
