import qs from 'query-string'

import APIService from './api-service'

import { IContactResource, IContactRequest, TEntityId } from '@/types'

/**
 * Service class to handle CRUD operations for contacts.
 */
export default class ContactService {
    private static readonly BASE_ENDPOINT = '/contacts'

    public static async getAll(): Promise<IContactResource[]> {
        const response = await APIService.get<IContactResource[]>(
            ContactService.BASE_ENDPOINT
        )
        return response.data
    }

    public static async create(
        contactData: IContactRequest
    ): Promise<IContactResource> {
        const response = await APIService.post<
            IContactRequest,
            IContactResource
        >(ContactService.BASE_ENDPOINT, contactData)
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${ContactService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        contactData: IContactRequest
    ): Promise<IContactResource> {
        const endpoint = `${ContactService.BASE_ENDPOINT}/${id}`
        const response = await APIService.put<
            IContactRequest,
            IContactResource
        >(endpoint, contactData)
        return response.data
    }

    public static async getById(
        id: TEntityId,
        preloads?: string
    ): Promise<IContactResource> {
        const url = qs.stringifyUrl(
            {
                url: `${ContactService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )
        const response = await APIService.get<IContactResource>(url)
        return response.data
    }
}
