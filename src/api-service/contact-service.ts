import qs from 'query-string'

import APIService from './api-service'

import { IContact, IContactRequest, TEntityId } from '@/types'

/**
 * Service class to handle CRUD operations for contacts.
 */
export default class ContactService {
    private static readonly BASE_ENDPOINT = '/contacts'

    public static async getAll(): Promise<IContact[]> {
        const response = await APIService.get<IContact[]>(
            ContactService.BASE_ENDPOINT
        )
        return response.data
    }

    public static async create(
        contactData: IContactRequest
    ): Promise<IContact> {
        const response = await APIService.post<IContactRequest, IContact>(
            ContactService.BASE_ENDPOINT,
            contactData
        )
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${ContactService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        contactData: IContactRequest
    ): Promise<IContact> {
        const endpoint = `${ContactService.BASE_ENDPOINT}/${id}`
        const response = await APIService.put<IContactRequest, IContact>(
            endpoint,
            contactData
        )
        return response.data
    }

    public static async getById(
        id: TEntityId,
        preloads?: string
    ): Promise<IContact> {
        const url = qs.stringifyUrl(
            {
                url: `${ContactService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )
        const response = await APIService.get<IContact>(url)
        return response.data
    }
}
