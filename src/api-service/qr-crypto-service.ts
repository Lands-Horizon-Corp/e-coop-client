import APIService from './api-service'

const BASE_ENDPOINT = '/qr'

export async function encryptQrData<TPayload = unknown>(data: TPayload) {
    const response = await APIService.post<TPayload, string>(
        `${BASE_ENDPOINT}/encrypt`,
        data
    )
    return response.data
}

export async function decryptQrData<TResponseData = unknown>(
    encryptedData: string
) {
    const response = await APIService.post<string, TResponseData>(
        `${BASE_ENDPOINT}/decrypt`,
        encryptedData
    )
    return response.data
}
