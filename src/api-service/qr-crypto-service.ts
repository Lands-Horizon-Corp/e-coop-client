import APIService from './api-service'

export const decryptQrData = async <TResponseData = unknown>(
    encryptedData: string
) => {
    const response = await APIService.get<TResponseData>(
        `/api/v1/qr-code/${encryptedData}`
    )
    return response.data
}
