import { useMutation, useQuery } from '@tanstack/react-query'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'
import { HookMutationOptions } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import { IUserBase } from '../user'
import {
    IAuthContext,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    ILoggedInUser,
    ISignInRequest,
    ISignUpRequest,
    IVerification,
    IVerificationPasswordRequest,
    IVerifyContactNumberRequest,
    IVerifyEmailRequest,
} from './authentication.types'

const { API, route: authenticationAPIRoute } = createAPIRepository(
    '/api/v1/authentication'
)

// ⚙️🛠️ API SERVICE HERE

export const currentAuth = async () => {
    const endpoint = `${authenticationAPIRoute}/current`
    return (await API.get<IAuthContext>(endpoint)).data
}

export const currentUser = async () => {
    const endpoint = `${authenticationAPIRoute}/current/user`
    return (await API.get<IAuthContext>(endpoint)).data
}

export const signIn = async (data: ISignInRequest) => {
    const endpoint = `${authenticationAPIRoute}/login`
    return (await API.post<ISignInRequest, IAuthContext>(endpoint, data)).data
}

export const signUp = async (data: ISignUpRequest) => {
    const endpoint = `${authenticationAPIRoute}/register`
    return (await API.post<ISignUpRequest, IAuthContext>(endpoint, data)).data
}

export const forgotPassword = async (data: IForgotPasswordRequest) => {
    const endpoint = `${authenticationAPIRoute}/forgot-password`
    await API.post<IForgotPasswordRequest, { key: string }>(endpoint, data)
    return data
}

export const changePassword = async (
    resetId: string,
    data: IChangePasswordRequest
) => {
    const endpoint = `${authenticationAPIRoute}/change-password/${resetId}`
    await API.post<IChangePasswordRequest, void>(endpoint, data)
}

export const verifyWithPassword = async (
    verificationData: IVerificationPasswordRequest
) => {
    const response = await API.post<
        IVerificationPasswordRequest,
        IVerification
    >(`${authenticationAPIRoute}/verify-with-password`, verificationData)
    return response.data
}

export const signOut = async () => {
    await API.post(`${authenticationAPIRoute}/logout`)
}

// API Functions for OTP Verification
export const requestContactNumberVerification = async (): Promise<void> => {
    const endpoint = `${authenticationAPIRoute}/apply-contact-number`
    await API.post(endpoint)
}

export const requestEmailVerification = async (): Promise<void> => {
    const endpoint = `${authenticationAPIRoute}/apply-email`
    await API.post(endpoint)
}

// FOR Verifying email and contact

// verify
export const verifyEmail = async (
    data: IVerifyEmailRequest
): Promise<IUserBase> => {
    const endpoint = `${authenticationAPIRoute}/verify-email`
    return (await API.post<IVerifyEmailRequest, IUserBase>(endpoint, data)).data
}

// Verify Contact Number
export const verifyContactNumber = async (
    data: IVerifyContactNumberRequest
): Promise<IUserBase> => {
    const endpoint = `${authenticationAPIRoute}/verify-contact-number`
    return (
        await API.post<IVerifyContactNumberRequest, IUserBase>(endpoint, data)
    ).data
}

// Current Logged in user
export const currentLoggedInUsers = async () => {
    // /authentication/current-logged-in-accounts
    const endpoint = `${authenticationAPIRoute}/current-logged-in-accounts`
    return (await API.get<ILoggedInUser[]>(endpoint)).data
}

// Sign out all logged in session of current user
export const signOutLoggedInUsers = async () => {
    const endpoint = `${authenticationAPIRoute}/current-logged-in-accounts/logout`
    await API.post<void>(endpoint)
}

export const checkResetLink = async (resetId: string) => {
    const endpoint = `${authenticationAPIRoute}/verify-reset-link/${resetId}`
    await API.get<void>(endpoint)
}

// 🪝 HOOK STARTS HERE

// Get Auth Context
export const useAuthContext = ({
    options,
}: {
    options?: HookQueryOptions<IAuthContext>
} = {}) => {
    return useQuery<IAuthContext>({
        queryKey: ['auth', 'context'],
        queryFn: currentAuth,
        ...options,
    })
}

// Get Current User
export const useCurrentUser = ({
    options,
}: {
    options?: HookQueryOptions<IAuthContext>
} = {}) => {
    return useQuery<IAuthContext>({
        queryKey: ['auth', 'current-user'],
        queryFn: currentUser,
        ...options,
    })
}

// Sign In
export const useSignIn = ({
    options,
}: {
    options?: HookMutationOptions<IAuthContext, Error, ISignInRequest>
} = {}) => {
    return useMutation<IAuthContext, Error, ISignInRequest>({
        mutationFn: signIn,
        ...options,
    })
}

// Sign Up
export const useSignUp = ({
    options,
}: {
    options?: HookMutationOptions<IAuthContext, Error, ISignUpRequest>
} = {}) => {
    return useMutation<IAuthContext, Error, ISignUpRequest>({
        mutationFn: signUp,
        ...options,
    })
}

// Forgot Password
export const useForgotPassword = ({
    options,
}: {
    options?: HookMutationOptions<
        { key: string },
        Error,
        IForgotPasswordRequest
    >
} = {}) => {
    return useMutation<{ key: string }, Error, IForgotPasswordRequest>({
        mutationFn: forgotPassword,
        ...options,
    })
}

// Change Password
export const useChangePassword = ({
    options,
}: {
    options?: HookMutationOptions<
        void,
        Error,
        IChangePasswordRequest & { resetId: string }
    >
} = {}) => {
    return useMutation<
        void,
        Error,
        IChangePasswordRequest & { resetId: string }
    >({
        mutationFn: ({ resetId, ...data }) => changePassword(resetId, data),
        ...options,
    })
}

// Sign Out
export const useSignOut = ({
    options,
}: {
    options?: HookMutationOptions<void, string, void>
}) => {
    return useMutation<void, string, void>({
        mutationFn: signOut,
        ...options,
    })
}

// FOr modals that requires retype password verification before an action

export const useVerifyPassword = ({
    options,
}: {
    options?: HookMutationOptions<
        IVerification,
        Error,
        IVerificationPasswordRequest
    >
} = {}) => {
    return useMutation<IVerification, Error, IVerificationPasswordRequest>({
        mutationFn: verifyWithPassword,
        ...options,
    })
}

export const useCheckResetId = ({
    resetId,
    options,
}: {
    resetId: TEntityId
    options?: HookQueryOptions<boolean, Error>
}) => {
    return useQuery<boolean, Error>({
        ...options,
        queryKey: ['reset-id', resetId],
        queryFn: async () => {
            await checkResetLink(resetId)
            return true
        },
    })
}

// Hook for sending OTP Verification
export const useSendOTPVerification = ({
    verifyMode,
    options,
}: {
    verifyMode: 'email' | 'mobile'
    options?: HookMutationOptions<void, Error>
}) => {
    return useMutation<void, Error>({
        mutationFn: async () => {
            if (verifyMode === 'email') {
                return await requestEmailVerification()
            } else if (verifyMode === 'mobile') {
                return await requestContactNumberVerification()
            }

            throw new Error('Unknown verify mode')
        },
        ...options,
    })
}

// Hook for Verifying Email or Contact Number
export const useVerify = ({
    verifyMode,
    options,
}: {
    verifyMode: 'email' | 'mobile'
    options?: HookMutationOptions<IUserBase, Error, { otp: string }>
}) => {
    return useMutation<IUserBase, Error, { otp: string }>({
        mutationKey: ['verify', verifyMode],
        mutationFn: async (data) => {
            if (verifyMode === 'email') {
                return await verifyEmail(data)
            } else if (verifyMode === 'mobile') {
                return await verifyContactNumber(data)
            }

            throw new Error('Unknown verify mode')
        },
        ...options,
    })
}

// Get Current Logged In User
export const useCurrentLoggedInUser = ({
    options,
}: {
    options?: HookQueryOptions<ILoggedInUser[], Error>
} = {}) => {
    return useQuery<ILoggedInUser[], Error>({
        ...options,
        queryKey: ['auth', 'current-logged-in-user'],
        queryFn: async () => await currentLoggedInUsers(),
    })
}

// Sign Out Current Logged In User
export const useCurrentLoggedInUserLogout = ({
    options,
}: {
    options?: HookMutationOptions<void, Error, void>
} = {}) => {
    return useMutation<void, Error, void>({
        ...options,
        mutationKey: ['auth', 'signout', 'current-logged-in-user'],
        mutationFn: async () => await signOutLoggedInUsers(),
    })
}
