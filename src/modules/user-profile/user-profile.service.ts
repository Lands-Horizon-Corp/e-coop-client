import { useMutation } from '@tanstack/react-query'

import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { HookMutationOptions } from '@/providers/repositories/data-layer-factory'

import { IUserBase } from '../user/user.types'
import {
    IUserProfileGeneralRequest,
    IUserProfilePhotoUpdateRequest,
    IUserProfileRequest,
    IUserProfileSecurityRequest,
} from './user-profile.types'

const { apiCrudService } = createDataLayerFactory({
    url: '/api/v1/profile',
    baseKey: 'user-profile',
})

// ⚙️🛠️ API SERVICE STARTS HERE

const { API, route } = apiCrudService
// Update general user profile settings
export const updateUserProfileGeneral = async (
    data: IUserProfileGeneralRequest
): Promise<IUserBase> => {
    const res = await API.put<IUserProfileGeneralRequest, IUserBase>(
        `${route}/general`,
        data
    )
    return res.data
}

// Update user profile details
export const updateUserProfile = async (
    data: IUserProfileRequest
): Promise<IUserBase> => {
    const res = await API.put<IUserProfileRequest, IUserBase>(
        `${route}/profile`,
        data
    )
    return res.data
}

// Update user security settings
export const updateUserProfileSecurity = async (
    data: IUserProfileSecurityRequest
): Promise<IUserBase> => {
    const res = await API.put<IUserProfileSecurityRequest, IUserBase>(
        `${route}/password`,
        data
    )
    return res.data
}

// Update user profile photo
export const updateUserProfilePhoto = async (
    data: IUserProfilePhotoUpdateRequest
): Promise<IUserBase> => {
    const res = await API.put<IUserProfilePhotoUpdateRequest, IUserBase>(
        `${route}/profile-picture`,
        data
    )
    return res.data
}

// 🪝 HOOK STARTS HERE

// Update general user profile settings
export const useUpdateUserProfileGeneral = ({
    options,
}: {
    options?: HookMutationOptions<IUserBase, Error, IUserProfileGeneralRequest>
} = {}) => {
    return useMutation<IUserBase, Error, IUserProfileGeneralRequest>({
        mutationFn: updateUserProfileGeneral,
        ...options,
    })
}

// Update user profile details
export const useUpdateUserProfile = ({
    options,
}: {
    options?: HookMutationOptions<IUserBase, Error, IUserProfileRequest>
} = {}) => {
    return useMutation<IUserBase, Error, IUserProfileRequest>({
        mutationFn: updateUserProfile,
        ...options,
    })
}

// Update user security settings
export const useUpdateUserProfileSecurity = ({
    options,
}: {
    options?: HookMutationOptions<IUserBase, Error, IUserProfileSecurityRequest>
} = {}) => {
    return useMutation<IUserBase, Error, IUserProfileSecurityRequest>({
        mutationFn: updateUserProfileSecurity,
        ...options,
    })
}

// Update user profile photo
export const useUpdateUserProfilePhoto = ({
    options,
}: {
    options?: HookMutationOptions<
        IUserBase,
        Error,
        IUserProfilePhotoUpdateRequest
    >
} = {}) => {
    return useMutation<IUserBase, Error, IUserProfilePhotoUpdateRequest>({
        mutationFn: updateUserProfilePhoto,
        ...options,
    })
}
