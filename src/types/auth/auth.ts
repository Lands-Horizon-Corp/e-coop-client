import { IMediaRequest } from '../coop-types/media'

export interface IChangePasswordRequest {
    otp?: string
    resetId?: string
    newPassword: string
    confirmPassword: string
}

export interface IForgotPasswordRequest {
    email: string
    emailTemplate?: string
    contactTemplate?: string
}

export interface ISendEmailVerificationRequest {
    emailTemplate?: string
}

export interface ISendContactNumberVerificationRequest {
    contactTemplate?: string
}

export interface ISignInRequest {
    email: string
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

    emailTemplate?: string
    contactTemplate?: string
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
    contactNumber: string
}

export interface IChangeUsernameRequest {
    password: string
    username: string
}
