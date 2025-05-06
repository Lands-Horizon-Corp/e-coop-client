import APIService from './api-service'

import { getSMSContent, getEmailContent } from '@/lib'
import {
    IBranch,
    IUserBase,
    IAuthContext,
    IOrganization,
    ISignUpRequest,
    ISignInRequest,
    INewPasswordRequest,
    IVerifyEmailRequest,
    IForgotPasswordRequest,
    IChangePasswordRequest,
    IVerifyContactNumberRequest,
    ISendEmailVerificationRequest,
    ISendContactNumberVerificationRequest,
} from '@/types'

const BASE_ENDPOINT = '/authentication'

export const currentAuth = async () => {
    const endpoint = `${BASE_ENDPOINT}/current`
    return (await APIService.get<IAuthContext>(endpoint)).data
}

export const currentAuthOrg = async () => {
    const endpoint = `${BASE_ENDPOINT}/current/org`
    return (await APIService.get<IOrganization>(endpoint)).data
}

export const currentAuthBranch = async () => {
    const endpoint = `${BASE_ENDPOINT}/current/branch`
    return (await APIService.get<IBranch>(endpoint)).data
}

export const currentUser = async () => {
    const endpoint = `${BASE_ENDPOINT}/current/user`
    return (await APIService.get<IUserBase>(endpoint)).data
}

export const signUp = async (data: ISignUpRequest) => {
    const endpoint = `${BASE_ENDPOINT}/register`
    data.emailTemplate = getEmailContent('otp')
    data.contactTemplate = getSMSContent('contactNumber')
    return (
        await APIService.post<
            ISignUpRequest,
            IAuthContext & { user: NonNullable<IUserBase> }
        >(endpoint, data)
    ).data
}

export const signIn = async (data: ISignInRequest) => {
    const endpoint = `${BASE_ENDPOINT}/login`
    return (await APIService.post<ISignInRequest, IAuthContext>(endpoint, data))
        .data
}

export const signOut = async () => {
    const endpoint = `${BASE_ENDPOINT}/logout`
    await APIService.post(endpoint)
}

// SENDS OTP
export const forgotPassword = async (data: IForgotPasswordRequest) => {
    data.emailTemplate = getEmailContent('changePassword')
    data.contactTemplate = getSMSContent('changePassword')
    const endpoint = `${BASE_ENDPOINT}/forgot-password`
    await APIService.post<IForgotPasswordRequest, void>(endpoint, data)
}

// CHANGES PASSWORD + WITH OTP
export const changePassword = async (data: IChangePasswordRequest) => {
    const endpoint = `${BASE_ENDPOINT}/change-password`
    await APIService.post<IChangePasswordRequest, void>(endpoint, data)
}

export const requestContactNumberVerification = async () => {
    const endpoint = `${BASE_ENDPOINT}/request-contact-number-verification`
    const data: ISendContactNumberVerificationRequest = {
        contactTemplate: getSMSContent('contactNumber'),
    }
    await APIService.post<ISendContactNumberVerificationRequest>(endpoint, data)
}

export const verifyContactNumber = async (
    data: IVerifyContactNumberRequest
) => {
    const endpoint = `${BASE_ENDPOINT}/verify-contact-number-verification`
    return await APIService.post<IVerifyContactNumberRequest, IUserBase>(
        endpoint,
        data
    )
}

export const requestEmailVerification = async () => {
    const endpoint = `${BASE_ENDPOINT}/request-email-verification`
    const data: ISendEmailVerificationRequest = {
        emailTemplate: getEmailContent('otp'),
    }
    await APIService.post<ISendEmailVerificationRequest>(endpoint, data)
}

export const verifyEmail = async (data: IVerifyEmailRequest) => {
    const endpoint = `${BASE_ENDPOINT}/verify-email-verification`
    return await APIService.post<IVerifyEmailRequest, IUserBase>(endpoint, data)
}

export const checkResetLink = async (resetId: string) => {
    const endpoint = `${BASE_ENDPOINT}/verify-reset-link/${resetId}`
    await APIService.get<void>(endpoint)
}

export const newPassword = async (data: INewPasswordRequest) => {
    const endpoint = `${BASE_ENDPOINT}/`
    await APIService.post<INewPasswordRequest>(endpoint, data)
}
