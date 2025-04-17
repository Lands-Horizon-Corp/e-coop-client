import APIService from './api-service'

/**
 * Service class for QR Data payload encryption and decryption service.
 */
export default class QrCryptoService {
    private static readonly BASE_ENDPOINT = '/qr'

    public static async encryptQrData<TPayload = unknown>(data: TPayload) {
        const response = await APIService.post<TPayload, string>(
            `${QrCryptoService.BASE_ENDPOINT}/encrypt`,
            data
        )
        return response.data
    }

    public static async decryptQrData<TResponseData = unknown>(
        encryptedData: string
    ) {
        const response = await APIService.post<string, TResponseData>(
            `${QrCryptoService.BASE_ENDPOINT}/decrypt`,
            encryptedData
        )
        return response.data
    }
}
