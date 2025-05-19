import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import {
    updateUserSettingsPhoto,
    updateUserSettingsGeneral,
    updateUserSettingsProfile,
    updateUserSettingsSecurity,
} from '@/api-service/user-settings-service'
import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'

import {
    IAPIHook,
    IUserBase,
    IMutationProps,
    IUserSettingsGeneralRequest,
    IUserSettingsProfileRequest,
    IUserSettingsSecurityRequest,
    IUserSettingsPhotoUpdateRequest,
} from '@/types'

export const useUpdateUserSettingsGeneral = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IUserBase> & IMutationProps) => {
    return useMutation<IUserBase, string, IUserSettingsGeneralRequest>({
        mutationKey: ['update-user-settings-general'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                updateUserSettingsGeneral(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage, error)
                throw errorMessage
            }

            onSuccess?.(response)
            return response
        },
    })
}

export const useUpdateUserSettingsProfile = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IUserBase> & IMutationProps) => {
    return useMutation<IUserBase, string, IUserSettingsProfileRequest>({
        mutationKey: ['update-user-settings-profile'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                updateUserSettingsProfile(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage, error)
                throw errorMessage
            }

            onSuccess?.(response)
            return response
        },
    })
}

export const useUpdateUserSettingsSecurity = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IUserBase, string> & IMutationProps) => {
    return useMutation<IUserBase, string, IUserSettingsSecurityRequest>({
        mutationKey: ['update-user-settings-security'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                updateUserSettingsSecurity(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(response)
            if (showMessage) toast.success('Password Saved')
            return response
        },
    })
}

export const useUpdateUserSettingsPhoto = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IUserBase> & IMutationProps) => {
    return useMutation<IUserBase, string, IUserSettingsPhotoUpdateRequest>({
        mutationKey: ['update-user-settings-photo'],
        mutationFn: async (data) => {
            const [error, response] = await withCatchAsync(
                updateUserSettingsPhoto(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage, error)
                throw errorMessage
            }

            onSuccess?.(response)
            return response
        },
    })
}
