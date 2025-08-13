import {
    IUserBase,
    IUserSettingsGeneralRequest,
    IUserSettingsPhotoUpdateRequest,
    IUserSettingsProfileRequest,
    IUserSettingsSecurityRequest,
} from '@/types'

import APIService from './api-service'

export const updateUserSettingsGeneral = async (
    data: IUserSettingsGeneralRequest
) => {
    const res = await APIService.put<IUserSettingsGeneralRequest, IUserBase>(
        `/api/v1/profile/general`,
        data
    )
    return res.data
}

export const updateUserSettingsProfile = async (
    data: IUserSettingsProfileRequest
) => {
    const res = await APIService.put<IUserSettingsProfileRequest, IUserBase>(
        `/api/v1/profile/profile`,
        data
    )
    return res.data
}

export const updateUserSettingsSecurity = async (
    data: IUserSettingsSecurityRequest
) => {
    const res = await APIService.put<IUserSettingsSecurityRequest, IUserBase>(
        `/api/v1/profile/password`,
        data
    )
    return res.data
}

export const updateUserSettingsPhoto = async (
    data: IUserSettingsPhotoUpdateRequest
) => {
    const res = await APIService.put<
        IUserSettingsPhotoUpdateRequest,
        IUserBase
    >(`/api/v1/profile/profile-picture`, data)
    return res.data
}
