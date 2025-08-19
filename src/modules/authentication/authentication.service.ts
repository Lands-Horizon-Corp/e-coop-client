import { useMutation, useQuery } from '@tanstack/react-query'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import {
    HookMutationOptions,
    HookQueryOptions,
} from '@/providers/repositories/data-layer-factory'

import {
    IAuthContext,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    ISignInRequest,
    ISignUpRequest,
    IVerification,
    IVerificationPasswordRequest,
} from './authentication.types'

// Mock AuthService for demonstration purposes
const AuthService = {
    signOut: async () => {
        // Simulate API call
        return Promise.resolve()
    },
}

const { API, route } = createAPIRepository('/api/v1/authentication')

// API Functions
export const currentAuth = async () => {
    const endpoint = `${route}/current`
    return (await API.get<IAuthContext>(endpoint)).data
}

export const currentUser = async () => {
    const endpoint = `${route}/current/user`
    return (await API.get<IAuthContext>(endpoint)).data
}

export const signIn = async (data: ISignInRequest) => {
    const endpoint = `${route}/login`
    return (await API.post<ISignInRequest, IAuthContext>(endpoint, data)).data
}

export const signUp = async (data: ISignUpRequest) => {
    const endpoint = `${route}/register`
    return (await API.post<ISignUpRequest, IAuthContext>(endpoint, data)).data
}

export const forgotPassword = async (data: IForgotPasswordRequest) => {
    const endpoint = `${route}/forgot-password`
    await API.post<IForgotPasswordRequest, { key: string }>(endpoint, data)
    return data
}

export const changePassword = async (
    resetId: string,
    data: IChangePasswordRequest
) => {
    const endpoint = `${route}/change-password/${resetId}`
    await API.post<IChangePasswordRequest, void>(endpoint, data)
}

export const verifyWithPassword = async (
    verificationData: IVerificationPasswordRequest
) => {
    const response = await API.post<
        IVerificationPasswordRequest,
        IVerification
    >(`${route}/verify-with-password`, verificationData)
    return response.data
}

// API Query Hooks

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
export const useSignOut = (
    options?: HookMutationOptions<void, string, void>
) => {
    return useMutation<void, string, void>({
        mutationFn: AuthService.signOut,
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
