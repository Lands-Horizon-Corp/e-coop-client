import { AxiosResponse } from 'axios'
import APIService from './api-service'

import { getSMSContent, getEmailContent } from '@/lib'
import {
    IUserData,
    ISignUpRequest,
    ISignInRequest,
    INewPasswordRequest,
    IVerifyEmailRequest,
    IForgotPasswordRequest,
    IChangePasswordRequest,
    IVerifyContactNumberRequest,
    ISendEmailVerificationRequest,
    ISendContactNumberVerificationRequest,
} from '../types'

export default class AuthService extends APIService {
    private static readonly BASE_ENDPOINT = '/auth'

    // GET - /auth/current-user
    public static async currentUser(): Promise<IUserData> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/current-user`
        return (await AuthService.get<IUserData>(endpoint)).data
    }

    // POST - /auth/signup
    public static async signUp(data: ISignUpRequest): Promise<IUserData> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/signup`
        data.emailTemplate = getEmailContent('otp')
        data.contactTemplate = getSMSContent('contactNumber')
        return (
            await AuthService.post<ISignUpRequest, IUserData>(endpoint, data)
        ).data
    }

    // POST - /auth/signin
    public static async signIn(data: ISignInRequest): Promise<IUserData> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/signin`
        return (
            await AuthService.post<ISignInRequest, IUserData>(endpoint, data)
        ).data
    }

    // POST - /auth/signout
    public static async signOut(): Promise<void> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/signout`
        await AuthService.post(endpoint)
    }

    // POST - /auth/forgot-password
    public static async forgotPassword(
        data: IForgotPasswordRequest
    ): Promise<void> {
        data.emailTemplate = getEmailContent('changePassword')
        data.contactTemplate = getSMSContent('changePassword')
        const endpoint = `${AuthService.BASE_ENDPOINT}/forgot-password`
        await AuthService.post<IForgotPasswordRequest, void>(endpoint, data)
    }

    // POST - /auth/change-password
    public static async changePassword(
        data: IChangePasswordRequest
    ): Promise<void> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/change-password`
        await AuthService.post<IChangePasswordRequest, void>(endpoint, data)
    }

    // GET - /auth/verify-reset-link/${resetId}
    public static async checkResetLink(resetId: string): Promise<void> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/verify-reset-link/${resetId}`
        await AuthService.get<void>(endpoint)
    }

    // POST - /auth/send-email-verification
    public static async sendEmailVerification(): Promise<void> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/send-email-verification`
        const data: ISendEmailVerificationRequest = {
            emailTemplate: getEmailContent('otp'),
        }
        await AuthService.post<ISendEmailVerificationRequest>(endpoint, data)
    }

    // POST - /auth/verify-email
    public static async verifyEmail(
        data: IVerifyEmailRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/verify-email`
        return await AuthService.post<IVerifyEmailRequest, IUserData>(
            endpoint,
            data
        )
    }

    // POST - /auth/send-contact-number-verification
    public static async sendContactVerification(): Promise<void> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/send-contact-number-verification`
        const data: ISendContactNumberVerificationRequest = {
            contactTemplate: getSMSContent('contactNumber'),
        }
        await AuthService.post<ISendContactNumberVerificationRequest>(
            endpoint,
            data
        )
    }

    // POST - /auth/verify-contact
    public static async verifyContactNumber(
        data: IVerifyContactNumberRequest
    ): Promise<AxiosResponse<IUserData>> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/verify-contact-number`
        return await AuthService.post<IVerifyContactNumberRequest, IUserData>(
            endpoint,
            data
        )
    }

    // POST - /auth/skip-verification
    public static async skipVerification(): Promise<IUserData> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/skip-verification`
        return (await AuthService.post<void, IUserData>(endpoint)).data
    }

    // POST - /auth/new-password
    public static async newPassword(data: INewPasswordRequest): Promise<void> {
        const endpoint = `${AuthService.BASE_ENDPOINT}/new-password`
        await AuthService.post<INewPasswordRequest>(endpoint, data)
    }
}
