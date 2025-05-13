import APIService from './api-service'

const BASE_ENDPOINT = '/qr'

export async function decryptQrData<TResponseData = unknown>(
    encryptedData: string
) {
    const response = await APIService.get<TResponseData>(
        `${BASE_ENDPOINT}/${encryptedData}`
    )
    return response.data
}
