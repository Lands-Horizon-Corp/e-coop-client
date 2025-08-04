import {
    IAuthContext,
    IBranch,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    ILoggedInUser,
    IOrganization,
    ISignInRequest,
    ISignUpRequest,
    IUserBase,
    IVerification,
    IVerificationPasswordRequest,
    IVerifyContactNumberRequest,
    IVerifyEmailRequest,
} from '@/types'

import APIService from '../api-service'

export const currentAuth = async () => {
    const endpoint = `/api/v1/authentication/current`
    return (await APIService.get<IAuthContext>(endpoint)).data
}

export const currentAuthOrg = async () => {
    const endpoint = `/api/v1/authentication/current/org`
    return (await APIService.get<IOrganization>(endpoint)).data
}

export const currentAuthBranch = async () => {
    const endpoint = `/api/v1/authentication/current/branch`
    return (await APIService.get<IBranch>(endpoint)).data
}

export const currentUser = async () => {
    const endpoint = `/api/v1/authentication/current/user`
    return (await APIService.get<IUserBase>(endpoint)).data
}

export const currentLoggedInUsers = async () => {
    // /authentication/current-logged-in-accounts
    const endpoint = `/api/v1/authentication/current-logged-in-accounts`
    return (await APIService.get<ILoggedInUser[]>(endpoint)).data
}

export const signUp = async (data: ISignUpRequest) => {
    const endpoint = `/api/v1/authentication/register`
    return (
        await APIService.post<
            ISignUpRequest,
            IAuthContext & { user: NonNullable<IUserBase> }
        >(endpoint, data)
    ).data
}

export const signIn = async (data: ISignInRequest) => {
    const endpoint = `/api/v1/authentication/login`
    return (await APIService.post<ISignInRequest, IAuthContext>(endpoint, data))
        .data
}

export const signOut = async () => {
    const endpoint = `/api/v1/authentication/logout`
    await APIService.post(endpoint)
}

export const signOutLoggedInUsers = async () => {
    const endpoint = `/api/v1/authentication/current-logged-in-accounts/logout`
    return await APIService.post(endpoint)
}

// SENDS OTP
export const forgotPassword = async (data: IForgotPasswordRequest) => {
    const endpoint = `/api/v1/authentication/forgot-password`
    await APIService.post<IForgotPasswordRequest, void>(endpoint, data)
}

// CHANGES PASSWORD + reset ID
export const changePassword = async (
    resetId: string,
    data: IChangePasswordRequest
) => {
    const endpoint = `/api/v1/authentication/change-password/${resetId}`
    await APIService.post<IChangePasswordRequest, void>(endpoint, data)
}

export const checkResetLink = async (resetId: string) => {
    const endpoint = `/api/v1/authentication/verify-reset-link/${resetId}`
    await APIService.get<void>(endpoint)
}

// request for verification codes
export const requestContactNumberVerification = async () => {
    const endpoint = `/api/v1/authentication/apply-contact-number`
    await APIService.post(endpoint)
}

export const requestEmailVerification = async () => {
    const endpoint = `/api/v1/authentication/apply-email`
    await APIService.post(endpoint)
}

// verify
export const verifyEmail = async (data: IVerifyEmailRequest) => {
    const endpoint = `/api/v1/authentication/verify-email`
    return await APIService.post<IVerifyEmailRequest, IUserBase>(endpoint, data)
}

export const verifyContactNumber = async (
    data: IVerifyContactNumberRequest
) => {
    const endpoint = `/api/v1/authentication/verify-contact-number`
    return await APIService.post<IVerifyContactNumberRequest, IUserBase>(
        endpoint,
        data
    )
}

// VERIFY WITH (pass)

export const verifyWithPassword = async (
    verificationData: IVerificationPasswordRequest
) => {
    const endpoint = `/api/v1/authentication/verify-with-password`
    const response = await APIService.post<
        IVerificationPasswordRequest,
        IVerification
    >(endpoint, verificationData)
    return response.data
}
