import { TEntityId } from '@/types'

import { USER_PROFILE_DURATION_UNITS } from './user-profile.constants'

export interface IUserProfileRequest {
    first_name: string
    middle_name?: string
    last_name: string
    suffix?: string
    birthdate?: string
    full_name?: string
}

export interface IUserProfilePhotoUpdateRequest {
    // ID of uploaded media
    media_id: TEntityId
}

export interface IUserProfileGeneralRequest {
    user_name?: string

    description?: string

    email?: string
    contact_number?: string
}

export interface IUserProfileSecurityRequest {
    old_password: string
    new_password: string
    confirm_password: string
}

export type TInactivityTimeUnit = (typeof USER_PROFILE_DURATION_UNITS)[number]

export interface IUserProfileInactivitySettings {
    enabled: boolean
    duration: number
    timeUnit: TInactivityTimeUnit
}
