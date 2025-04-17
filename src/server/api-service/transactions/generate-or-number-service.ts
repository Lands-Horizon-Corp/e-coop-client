import { IGenerateORNumberResource } from '@/server/types/transactions/generate-or-number'
import APIService from '../api-service'

export default class OfficialReceiptService {
    private static readonly BASE_ENDPOINT = '/official-receipt'

    public static async get(): Promise<IGenerateORNumberResource> {
        const response = await APIService.get<IGenerateORNumberResource>(
            `${OfficialReceiptService.BASE_ENDPOINT}`
        )
        return response.data
    }
    public static async update(or: number): Promise<IGenerateORNumberResource> {
        const response = await APIService.put<IGenerateORNumberResource>(
            `${OfficialReceiptService.BASE_ENDPOINT}`,
            { OR: or }
        )
        return response.data as IGenerateORNumberResource
    }
}
