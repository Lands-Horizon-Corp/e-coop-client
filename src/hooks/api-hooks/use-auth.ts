import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as AuthService from '@/api-service/security-services/auth-service'

import {
    IUserBase,
    IAuthContext,
    ISignInRequest,
    ISignUpRequest,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    ILoggedInUser,
} from '@/types'
import {
    IAPIHook,
    IMutationProps,
    IOperationCallbacks,
    IQueryProps,
} from '../../types/api-hooks-types'

// Get auth context (Full: user, org, branch, etc...)
export const useAuthContext = ({
    onSuccess,
    onError,
    retry = 0,
    showMessage,
    ...others
}: IAPIHook<IAuthContext> & IQueryProps<IAuthContext> = {}) => {
    return useQuery<IAuthContext, string>({
        queryKey: ['current-auth'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                AuthService.currentAuth()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage, error)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        retry,
        ...others,
    })
}

// Get Current User
export const useCurrentUser = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IUserBase>) => {
    return useQuery<IUserBase, string>({
        queryKey: ['current-user'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                AuthService.currentUser()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        retry: 1,
    })
}
// Get Current User
export const useCurrentLoggedInUser = ({
    onError,
    onSuccess,
}: IOperationCallbacks<ILoggedInUser[]>) => {
    return useQuery<ILoggedInUser[], string>({
        queryKey: ['current-logged-in-user'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                AuthService.currentLoggedInUsers()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        retry: 1,
    })
}

export const useCurrentLoggedInUserLogout = ({
    onError,
    onSuccess,
}: IOperationCallbacks<void> | undefined = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string>({
        mutationKey: ['auth', 'signout', 'current-logged-in-user'],
        mutationFn: async () => {
            const [error] = await withCatchAsync(
                AuthService.signOutLoggedInUsers()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Signed out successfully')
            onSuccess?.()

            // Invalidate cached data
            queryClient.invalidateQueries({
                queryKey: ['auth', 'current-user'],
            })
        },
    })
}

// Sign In
export const useSignIn = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IAuthContext, string>) => {
    const queryClient = useQueryClient()

    return useMutation<IAuthContext, string, ISignInRequest>({
        mutationKey: ['auth', 'signin'],
        mutationFn: async (credentials) => {
            const [error, data] = await withCatchAsync(
                AuthService.signIn(credentials)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
            queryClient.removeQueries()

            toast.success('Signed in successfully')
            onSuccess?.(data)

            // Optionally prefetch or update user data
            queryClient.setQueryData(['auth', 'current-user'], data)
            return data
        },
    })
}

// Sign Up
export const useSignUp = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IAuthContext, string> | undefined = {}) => {
    return useMutation<
        IAuthContext & { user: NonNullable<IUserBase> },
        string,
        ISignUpRequest
    >({
        mutationKey: ['auth', 'signup'],
        mutationFn: async (newUser) => {
            const [error, data] = await withCatchAsync(
                AuthService.signUp(newUser)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Signed up successfully')
            onSuccess?.(data)
            return data
        },
    })
}

// Forgot Password
export const useForgotPassword = ({
    onError,
    onSuccess,
}:
    | IOperationCallbacks<
          {
              key: string
          },
          string
      >
    | undefined = {}) => {
    return useMutation<
        {
            key: string
        },
        string,
        IForgotPasswordRequest
    >({
        mutationKey: ['auth', 'forgot-password'],
        mutationFn: async (data) => {
            const [error] = await withCatchAsync(
                AuthService.forgotPassword(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Password reset link sent')
            onSuccess?.(data)

            return data
        },
    })
}

// Change Password
export const useChangePassword = ({
    onError,
    onSuccess,
}: IOperationCallbacks<void> = {}) => {
    return useMutation<
        void,
        string,
        IChangePasswordRequest & { resetId: string }
    >({
        mutationKey: ['auth', 'change-password'],
        mutationFn: async (data) => {
            const [error] = await withCatchAsync(
                AuthService.changePassword(data.resetId, data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Password changed successfully')
            onSuccess?.()
        },
    })
}

// Sign Out
export const useSignOut = ({
    onError,
    onSuccess,
}: IOperationCallbacks<void> | undefined = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string>({
        mutationKey: ['auth', 'signout'],
        mutationFn: async () => {
            const [error] = await withCatchAsync(AuthService.signOut())

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Signed out successfully')
            onSuccess?.()

            // Invalidate cached data
            queryClient.invalidateQueries({
                queryKey: ['auth', 'current-user'],
            })
        },
    })
}

export const useVerify = ({
    verifyMode,
    onSuccess,
    onError,
}: { verifyMode: 'email' | 'mobile' } & IOperationCallbacks<
    IUserBase,
    string
>) => {
    return useMutation<IUserBase, string, { otp: string }>({
        mutationKey: ['verify', verifyMode],
        mutationFn: async (data) => {
            try {
                if (verifyMode === 'email') {
                    const response = await AuthService.verifyEmail(data)
                    toast.success('Email verified')
                    onSuccess?.(response.data)
                    return response.data
                }

                if (verifyMode === 'mobile') {
                    const response = await AuthService.verifyContactNumber(data)
                    toast.success('Contact verified')
                    onSuccess?.(response.data)
                    return response.data
                }

                throw 'Unknown verify mode'
            } catch (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
        },
    })
}

export const useCheckResetId = ({
    resetId,
    onError,
    onSuccess,
    showMessage,
    ...others
}: { resetId: string } & IAPIHook<boolean> & IQueryProps<boolean>) => {
    return useQuery<boolean, string>({
        queryKey: ['password-reset-link', resetId],
        queryFn: async () => {
            const [error] = await withCatchAsync(
                AuthService.checkResetLink(resetId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.message(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(true)
            return true
        },
        initialData: undefined,
        ...others,
    })
}

export const useOTPVerification = ({
    verifyMode,
    onSuccess,
    onError,
}: { verifyMode: 'email' | 'mobile' } & IAPIHook<void, string> &
    IMutationProps) => {
    return useMutation<void, string>({
        mutationKey: ['auth', 'send-contact-verification', verifyMode],
        mutationFn: async () => {
            try {
                if (verifyMode === 'email') {
                    await AuthService.requestEmailVerification()
                    toast.success('OTP Resent to your email')
                    onSuccess?.()
                    return
                }

                if (verifyMode === 'mobile') {
                    await AuthService.requestContactNumberVerification()
                    toast.success('OTP Resent to your mobile')
                    onSuccess?.()
                    return
                }

                throw 'Unkown verify mode'
            } catch (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
        },
    })
}
