import { IMediaRequest } from './media'
import { TAccountType, IUserBase } from '../common'

export interface IUserData extends IUserBase {
    accountType: TAccountType
}

export interface IChangePasswordRequest {
    otp?: string
    resetId?: string
    newPassword: string
    confirmPassword: string
}

export interface IForgotPasswordRequest {
    key: string
    accountType: TAccountType
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
    email?: string
    username?: string
    password: string
    accountType: TAccountType
}

export interface ISignUpRequest {
    accountType: TAccountType
    username: string
    firstName: string
    lastName: string
    middleName?: string
    email: string
    password: string
    confirmPassword: string
    birthDate: Date
    contactNumber: string
    permanentAddress: string
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
