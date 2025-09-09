import { IGeneratedReport } from '../generated-reports'
import { IUserBase } from '../user'
import { IUserOrganization } from '../user-organization'
import { TVerificationPasswordAdminSchema } from './authentication.validation'

export interface IAuthContext<TUser = IUserBase | undefined> {
    user?: TUser
    user_organization?: IUserOrganization | null
    reports: IGeneratedReport[]
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

    birthdate: string
}

// FOR Verification

export interface IVerifyEmailRequest {
    otp: string
}

export interface IVerifyContactNumberRequest {
    otp: string
}

export interface ILoggedInUser {
    accept_language: string
    device_type: string
    ip_address: string
    language: string
    latitude: number
    location: string
    longitude: number
    user_agent: string
}

export interface IVerificationPasswordRequest {
    password: string
}

export type IVerificationPasswordAdminRequest = TVerificationPasswordAdminSchema

export interface IVerification {
    success: boolean
    message: string
}
