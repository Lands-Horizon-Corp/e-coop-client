import APIService from '../api-service'

import {
    IBranch,
    IUserBase,
    IAuthContext,
    IVerification,
    ILoggedInUser,
    IOrganization,
    ISignUpRequest,
    ISignInRequest,
    IVerifyEmailRequest,
    IForgotPasswordRequest,
    IChangePasswordRequest,
    IVerifyContactNumberRequest,
    IVerificationPasswordRequest,
} from '@/types'

export const currentAuth = async () => {
    const endpoint = `/authentication/current`
    return (await APIService.get<IAuthContext>(endpoint)).data
}

export const currentAuthOrg = async () => {
    const endpoint = `/authentication/current/org`
    return (await APIService.get<IOrganization>(endpoint)).data
}

export const currentAuthBranch = async () => {
    const endpoint = `/authentication/current/branch`
    return (await APIService.get<IBranch>(endpoint)).data
}

export const currentUser = async () => {
    const endpoint = `/authentication/current/user`
    return (await APIService.get<IUserBase>(endpoint)).data
}

export const currentLoggedInUsers = async () => {
    // /authentication/current-logged-in-accounts
    const endpoint = `/authentication/current-logged-in-accounts`
    return (await APIService.get<ILoggedInUser[]>(endpoint)).data
}

export const signUp = async (data: ISignUpRequest) => {
    const endpoint = `/authentication/register`
    return (
        await APIService.post<
            ISignUpRequest,
            IAuthContext & { user: NonNullable<IUserBase> }
        >(endpoint, data)
    ).data
}

export const signIn = async (data: ISignInRequest) => {
    const endpoint = `/authentication/login`
    return (await APIService.post<ISignInRequest, IAuthContext>(endpoint, data))
        .data
}

export const signOut = async () => {
    const endpoint = `/authentication/logout`
    await APIService.post(endpoint)
}

export const signOutLoggedInUsers = async () => {
    const endpoint = `/authentication/current-logged-in-accounts/logout`
    return await APIService.post(endpoint)
}

// SENDS OTP
export const forgotPassword = async (data: IForgotPasswordRequest) => {
    const endpoint = `/authentication/forgot-password`
    await APIService.post<IForgotPasswordRequest, void>(endpoint, data)
}

// CHANGES PASSWORD + reset ID
export const changePassword = async (
    resetId: string,
    data: IChangePasswordRequest
) => {
    const endpoint = `/authentication/change-password/${resetId}`
    await APIService.post<IChangePasswordRequest, void>(endpoint, data)
}

export const checkResetLink = async (resetId: string) => {
    const endpoint = `/authentication/verify-reset-link/${resetId}`
    await APIService.get<void>(endpoint)
}

// request for verification codes
export const requestContactNumberVerification = async () => {
    const endpoint = `/authentication/apply-contact-number`
    await APIService.post(endpoint)
}

export const requestEmailVerification = async () => {
    const endpoint = `/authentication/apply-email`
    await APIService.post(endpoint)
}

// verify
export const verifyEmail = async (data: IVerifyEmailRequest) => {
    const endpoint = `/authentication/verify-email`
    return await APIService.post<IVerifyEmailRequest, IUserBase>(endpoint, data)
}

export const verifyContactNumber = async (
    data: IVerifyContactNumberRequest
) => {
    const endpoint = `/authentication/verify-contact-number`
    return await APIService.post<IVerifyContactNumberRequest, IUserBase>(
        endpoint,
        data
    )
}

// VERIFY WITH (pass)

export const verifyWithPassword = async (
    verificationData: IVerificationPasswordRequest
) => {
    const endpoint = `/authentication/verify-with-password`
    const response = await APIService.post<
        IVerificationPasswordRequest,
        IVerification
    >(endpoint, verificationData)
    return response.data
}
