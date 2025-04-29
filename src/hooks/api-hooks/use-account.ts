import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import ProfileService from '@/api-service/profile-service'

import {
    IUserData,
    IMediaResource,
    INewPasswordRequest,
    IChangeEmailRequest,
    IChangeUsernameRequest,
    IAccountSettingRequest,
    IChangeContactNumberRequest,
} from '@/types/coop-types'
import { IOperationCallbacks } from './types'

// Hook: Upload Profile Picture
export const useUploadAccountProfilePicture = ({
    onError,
    onSuccess,
    invalidateCurrentUser,
}: { invalidateCurrentUser?: boolean } & IOperationCallbacks<IUserData>) => {
    const queryClient = useQueryClient()

    return useMutation<IUserData, string, IMediaResource>({
        mutationKey: ['account', 'profile'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                ProfileService.profilePicture(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(errorMessage)
                toast.error(errorMessage)
                throw errorMessage
            }

            if (invalidateCurrentUser)
                queryClient.invalidateQueries({ queryKey: ['current-user'] })

            onSuccess?.(response.data)
            return response.data
        },
    })
}

// Hook: Update Account Settings
export const useUpdateAccountSettings = ({
    onError,
    onSuccess,
}: undefined | IOperationCallbacks<IUserData, string> = {}) => {
    return useMutation<IUserData, string, IAccountSettingRequest>({
        mutationKey: ['account', 'account-setting'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                ProfileService.accountSetting(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Account settings updated successfully')
            onSuccess?.(response.data)

            return response.data
        },
    })
}

// Hook: Change Password
export const useUpdateAccountPassword = ({
    onError,
    onSuccess,
}: undefined | IOperationCallbacks<void, string> = {}) => {
    return useMutation<void, string, INewPasswordRequest>({
        mutationKey: ['account', 'new-password'],
        mutationFn: async (data) => {
            const [error] = await withCatchAsync(
                ProfileService.newPassword(data)
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

// Hook: Change Contact Number
export const useUpdateAccountContactNumber = ({
    onError,
    onSuccess,
}: undefined | IOperationCallbacks<IUserData, string> = {}) => {
    return useMutation<IUserData, string, IChangeContactNumberRequest>({
        mutationKey: ['account', 'change-contact-number'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                ProfileService.changeContactNumber(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Contact number updated successfully')
            onSuccess?.(response.data)

            return response.data
        },
    })
}

// Hook: Change Email
export const useUpdateAccountEmail = ({
    onError,
    onSuccess,
}: undefined | IOperationCallbacks<IUserData, string> = {}) => {
    return useMutation<IUserData, string, IChangeEmailRequest>({
        mutationKey: ['account', 'change-email'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                ProfileService.changeEmail(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Email changed successfully')
            onSuccess?.(response.data)

            return response.data
        },
    })
}

// Hook: Change Username
export const useUpdateAccountUsername = ({
    onError,
    onSuccess,
}: undefined | IOperationCallbacks<IUserData, string> = {}) => {
    return useMutation<IUserData, string, IChangeUsernameRequest>({
        mutationKey: ['account', 'change-username'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                ProfileService.changeUsername(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            toast.success('Username changed successfully')
            onSuccess?.(response.data)

            return response.data
        },
    })
}
