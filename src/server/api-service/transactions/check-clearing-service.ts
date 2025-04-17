import { ICheckClearingRequest } from '@/server/types/transactions/check-clearing'
import APIService from '../api-service'

export default class CheckClearingService {
    private static readonly BASE_ENDPOINT = '/check-clearing'

    public static async create(
        paymentData: ICheckClearingRequest[]
    ): Promise<ICheckClearingRequest[]> {
        const response = await APIService.post<ICheckClearingRequest[]>(
            CheckClearingService.BASE_ENDPOINT,
            paymentData
        )

        return response.data as ICheckClearingRequest[]
    }
}
