import APIService from './api-service'

import {
    IUserBase,
    IUserSettingsProfileRequest,
    IUserSettingsGeneralRequest,
    IUserSettingsSecurityRequest,
    IUserSettingsPhotoUpdateRequest,
} from '@/types'


export const updateUserSettingsGeneral = async (
    data: IUserSettingsGeneralRequest
) => {
    const res = await APIService.put<IUserSettingsGeneralRequest, IUserBase>(
        `/profile/general`,
        data
    )
    return res.data
}

export const updateUserSettingsProfile = async (
    data: IUserSettingsProfileRequest
) => {
    const res = await APIService.put<IUserSettingsProfileRequest, IUserBase>(
        `/profile/profile`,
        data
    )
    return res.data
}

export const updateUserSettingsSecurity = async (
    data: IUserSettingsSecurityRequest
) => {
    const res = await APIService.put<IUserSettingsSecurityRequest, IUserBase>(
        `/profile/password`,
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
    >(`/profile/profile-picture`, data)
    return res.data
}
