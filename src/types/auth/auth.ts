import { IMediaRequest } from '../coop-types/media'

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

export interface IVerifyEmailRequest {
    otp: string
}

export interface IVerifyContactNumberRequest {
    otp: string
}

export interface INewPasswordRequest {
    NewPassword: string
    ConfirmPassword: string
    PreviousPassword: string
}

export interface IAccountSettingRequest {
    birthDate: Date
    lastName: string
    firstName: string
    middleName?: string
    description?: string
    permanentAddress: string
}

export interface IChangeEmailRequest {
    password: string
    email: string
}

export interface IChangeContactNumberRequest {
    password: string
    contact_number: string
}

export interface IChangeUsernameRequest {
    password: string
    user_name: string
}
