import { IAuditable, ITimeStamps, TEntityId, TUserType } from '@/types/common'

import { IFootstep } from '../footstep'
import { IMedia } from '../media/media.types'

// api/v1/authentication/current/user
export interface IUserBase extends ITimeStamps, IAuditable {
    id: TEntityId
    media_id?: TEntityId
    media?: IMedia
    api_key: string
    password: string
    birthdate?: string
    user_name: string
    first_name?: string
    middle_name?: string
    last_name?: string
    full_name: string
    suffix?: string
    email: string
    is_email_verified?: boolean
    type?: TUserType
    contact_number: string
    is_contact_verified?: boolean
    // qr_code: IQrScanResult<string, 'user-qr'>
}

export interface IEmployee extends IUserBase {
    type: 'employee'
}

export interface IOwner extends IUserBase {
    type: 'owner'
}

export interface IMember extends IUserBase {
    type: 'member'
}

// ---------- Base Types ----------
export interface IUser extends ITimeStamps {
    id: string
    media_id?: string
    signature_media_id?: string
    birthdate?: string
    user_name: string
    first_name?: string | null
    middle_name?: string | null
    last_name?: string | null
    full_name?: string
    suffix?: string | null
    description?: string | null
    email: string
    is_email_verified: boolean
    contact_number: string
    is_contact_verified: boolean

    media?: IMedia
    signature_media?: IMedia

    foot_steps?: IFootstep[]
    notifications?: TNotificationResponse[]
    // generated_reports?: TGeneratedReportResponse[];
    user_organizations?: TUserOrganization[]
}

export interface ICurrentUserResponse {
    user_id: string
    user?: IUser
    user_organization: TUserOrganization
    is_logged_in_on_other_device: boolean
    users?: IUser[]
}

// ---------- Auth & Settings Requests ----------
export interface IUserLoginRequest {
    key: string
    password: string
}

export interface IUserRegisterRequest {
    email: string
    password: string
    birthdate?: string
    user_name: string
    full_name?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    suffix?: string
    contact_number: string
    media_id?: string
}

export interface IUserForgotPasswordRequest {
    key: string
}

export interface IUserChangePasswordRequest {
    new_password: string
    confirm_password: string
}

export interface IUserVerifyRequest {
    otp: string
}

export interface IUserVerifyWithContactNumberRequest {
    contact_number: string
}

export interface IUserVerifyWithPasswordRequest {
    password: string
}

export interface IUserSettingsChangePasswordRequest {
    old_password: string
    new_password: string
    confirm_password: string
}

export interface IUserSettingsChangeEmailRequest {
    email: string
    password: string
}

export interface IUserSettingsChangeUsernameRequest {
    user_name: string
    password: string
}

export interface IUserSettingsChangeContactNumberRequest {
    contact_number: string
    password: string
}

export interface IUserSettingsChangeProfilePictureRequest {
    media_id: string
}

export interface IUserSettingsChangeProfileRequest {
    birthdate: string
    description?: string
    first_name?: string
    middle_name?: string
    last_name?: string
    full_name?: string
    suffix?: string
}

export interface IUserSettingsChangeGeneralRequest {
    contact_number: string
    description?: string
    email: string
    user_name: string
}
