import { AxiosResponse } from 'axios'

import APIService from './api-service'
import AuthService from './auth-service'

import {
    IUserData,
    IMediaRequest,
    INewPasswordRequest,
    IChangeEmailRequest,
    IChangeUsernameRequest,
    IAccountSettingRequest,
    IChangeContactNumberRequest,
} from '../types'

export default class ProfileService extends APIService {
    private static readonly BASE_ENDPOINT = '/profile'

    // POST - /profile/profile-picture
    public static async profilePicture(
        data: IMediaRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${ProfileService.BASE_ENDPOINT}/profile-picture`
        return await this.post<IMediaRequest, IUserData>(endpoint, data)
    }

    public static async accountSetting(
        data: IAccountSettingRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${ProfileService.BASE_ENDPOINT}/account-setting`
        return await this.post<IAccountSettingRequest, IUserData>(
            endpoint,
            data
        )
    }

    public static async newPassword(data: INewPasswordRequest): Promise<void> {
        return AuthService.newPassword(data)
    }

    public static async changeContactNumber(
        data: IChangeContactNumberRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${ProfileService.BASE_ENDPOINT}/change-contact-number`
        return await this.post<IChangeContactNumberRequest, IUserData>(
            endpoint,
            data
        )
    }

    public static async changeEmail(
        data: IChangeEmailRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${ProfileService.BASE_ENDPOINT}/change-email`
        return await this.post<IChangeEmailRequest, IUserData>(endpoint, data)
    }

    public static async changeUsername(
        data: IChangeUsernameRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${ProfileService.BASE_ENDPOINT}/change-username`
        return await this.post<IChangeUsernameRequest, IUserData>(
            endpoint,
            data
        )
    }
}
