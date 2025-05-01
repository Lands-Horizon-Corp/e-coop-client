import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import AuthService from '@/api-service/auth-service'

import {
    IUserData,
    TUserType,
    ISignInRequest,
    ISignUpRequest,
    IChangePasswordRequest,
    IForgotPasswordRequest,
} from '@/types'
import { IOperationCallbacks } from './types'

// Loader for Auth Preloading
export const authLoader = () =>
    queryOptions<IUserData>({
        queryKey: ['auth', 'current-user'],
        queryFn: async () => {
            return await AuthService.currentUser()
        },
        retry: 0,
    })

// Hook: Get Current User
export const useCurrentUser = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IUserData>) => {
    return useQuery<IUserData, string>({
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

// Hook: Sign In
export const useSignIn = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IUserData, string>) => {
    const queryClient = useQueryClient()

    return useMutation<IUserData, string, ISignInRequest>({
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

// Hook: Sign Up
export const useSignUp = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IUserData, string> | undefined = {}) => {
    return useMutation<IUserData, string, ISignUpRequest>({
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

// Hook: Forgot Password
export const useForgotPassword = ({
    onError,
    onSuccess,
}:
    | IOperationCallbacks<
          {
              key: string
              accountType: TUserType
          },
          string
      >
    | undefined = {}) => {
    return useMutation<
        {
            key: string
            accountType: TUserType
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

// Hook: Change Password
export const useChangePassword = ({
    onError,
    onSuccess,
}: undefined | IOperationCallbacks<void> = {}) => {
    return useMutation<void, string, IChangePasswordRequest>({
        mutationKey: ['auth', 'change-password'],
        mutationFn: async (data) => {
            const [error] = await withCatchAsync(
                AuthService.changePassword(data)
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

// Hook: Sign Out
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

export const useCheckResetId = ({
    resetId,
    onError,
    onSuccess,
}: { resetId: string } & IOperationCallbacks<boolean>) => {
    return useQuery<null | boolean, string>({
        queryKey: ['password-reset-link', resetId],
        queryFn: async () => {
            const [error] = await withCatchAsync(
                AuthService.checkResetLink(resetId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.message(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(true)
            return true
        },
        initialData: null,
    })
}

export const useVerify = ({
    verifyMode,
    onSuccess,
    onError,
}: { verifyMode: 'email' | 'mobile' } & IOperationCallbacks<
    IUserData,
    string
>) => {
    return useMutation<IUserData, string, { otp: string }>({
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

export const useSendUserContactOTPVerification = ({
    verifyMode,
    onSuccess,
    onError,
}: { verifyMode: 'email' | 'mobile' } & IOperationCallbacks<void, string>) => {
    return useMutation<void, string>({
        mutationKey: ['auth', 'send-contact-verification', verifyMode],
        mutationFn: async () => {
            try {
                if (verifyMode === 'email') {
                    await AuthService.sendEmailVerification()
                    toast.success('OTP Resent to your email')
                    onSuccess?.()
                    return
                }

                if (verifyMode === 'mobile') {
                    await AuthService.sendContactVerification()
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

export const useSkipUserContactVerification = ({
    onSuccess,
    onError,
}: undefined | IOperationCallbacks<IUserData, string> = {}) => {
    return useMutation<IUserData, string>({
        mutationKey: ['auth', 'skip-verify'],
        mutationFn: async () => {
            const [error, response] = await withCatchAsync(
                AuthService.skipVerification()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(response)

            return response
        },
    })
}
