import APIService from './api-service'

import {
    IUserBase,
    IUserSettingsProfileRequest,
    IUserSettingsGeneralRequest,
    IUserSettingsSecurityRequest,
    IUserSettingsPhotoUpdateRequest,
} from '@/types'

const BASE_ENDPOINT = '/user'

export const updateUserSettingsGeneral = async (
    data: IUserSettingsGeneralRequest
) => {
    const res = await APIService.patch<IUserSettingsGeneralRequest, IUserBase>(
        `${BASE_ENDPOINT}/general`,
        data
    )
    return res.data
}

export const updateUserSettingsProfile = async (
    data: IUserSettingsProfileRequest
) => {
    const res = await APIService.patch<IUserSettingsProfileRequest, IUserBase>(
        `${BASE_ENDPOINT}/profile`,
        data
    )
    return res.data
}

export const updateUserSettingsSecurity = async (
    data: IUserSettingsSecurityRequest
) => {
    const res = await APIService.patch<IUserSettingsSecurityRequest, IUserBase>(
        `${BASE_ENDPOINT}/security`,
        data
    )
    return res.data
}

export const updateUserSettingsPhoto = async (
    data: IUserSettingsPhotoUpdateRequest
) => {
    const res = await APIService.patch<
        IUserSettingsPhotoUpdateRequest,
        IUserBase
    >(`${BASE_ENDPOINT}/photo`, data)
    return res.data
}

export const requestContactNumberVerification = async () => {
    const endpoint = `${BASE_ENDPOINT}/request-contact-number-verification`
    await APIService.post(endpoint)
}
