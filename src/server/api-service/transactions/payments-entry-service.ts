import APIService from '../api-service'
import { IPaymentsEntryRequest } from '@/server/types/transactions/payments-entry'

export default class PaymentsEntryService {
    private static readonly BASE_ENDPOINT = '/payments-entry'

    public static async create(
        paymentData: IPaymentsEntryRequest[]
    ): Promise<IPaymentsEntryRequest[]> {
        const response = await APIService.post<IPaymentsEntryRequest[]>(
            PaymentsEntryService.BASE_ENDPOINT,
            paymentData
        )

        return response.data as IPaymentsEntryRequest[]
    }
}
