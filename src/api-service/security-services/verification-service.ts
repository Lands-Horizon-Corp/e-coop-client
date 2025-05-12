// use for password, email, number protected action (Use only on authed places)

import APIService from '../api-service'
import { IVerification, IVerificationPasswordRequest } from '@/types'

const BASE_ENDPOINT = '/user/security'

export const verifyWithPassword = async (
    verificationData: IVerificationPasswordRequest
) => {
    const endpoint = `${BASE_ENDPOINT}/verify-with-password`
    const response = await APIService.post<
        IVerificationPasswordRequest,
        IVerification
    >(endpoint, verificationData)
    return response.data
}
