import { IUserBase } from './user'
import { IBranch } from '../coop-types'
import { IMediaRequest } from '../coop-types/media'
import { IGeneratedReport, IOrganization } from '../lands-types'

// returned by /authentication/current
export interface IAuthContext<TUser = IUserBase | undefined> {
    user?: TUser
    organization?: IOrganization
    branch?: IBranch
    reports: IGeneratedReport[]
    role: string[]
}

export interface IChangePasswordRequest {
    new_password: string
    confirm_password: string
}

export interface IForgotPasswordRequest {
    key: string
}

export interface ISignInRequest {
    key: string
    password: string
}

export interface ISignUpRequest {
    user_name: string
    first_name: string
    last_name: string
    middle_name?: string
    full_name: string
    suffix?: string

    email: string
    contact_number: string
    password: string

    birthdate: Date
    media?: IMediaRequest
}

// FOR Verification

export interface IVerifyEmailRequest {
    otp: string
}

export interface IVerifyContactNumberRequest {
    otp: string
}
