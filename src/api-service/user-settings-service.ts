import APIService from './api-service'

import {
    IUserBase,
    IUserSettingsProfileRequest,
    IUserSettingsGeneralRequest,
    IUserSettingsSecurityRequest,
    IUserSettingsPhotoUpdateRequest,
} from '@/types'

const BASE_ENDPOINT = '/profile'

export const updateUserSettingsGeneral = async (
    data: IUserSettingsGeneralRequest
) => {
    const res = await APIService.put<IUserSettingsGeneralRequest, IUserBase>(
        `${BASE_ENDPOINT}/general`,
        data
    )
    return res.data
}

export const updateUserSettingsProfile = async (
    data: IUserSettingsProfileRequest
) => {
    const res = await APIService.put<IUserSettingsProfileRequest, IUserBase>(
        `${BASE_ENDPOINT}/profile`,
        data
    )
    return res.data
}

export const updateUserSettingsSecurity = async (
    data: IUserSettingsSecurityRequest
) => {
    const res = await APIService.put<IUserSettingsSecurityRequest, IUserBase>(
        `${BASE_ENDPOINT}/security`,
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
    >(`${BASE_ENDPOINT}/profile-picture`, data)
    return res.data
}
