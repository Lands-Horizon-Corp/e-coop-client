import qs from 'query-string'

import APIService from './api-service'

import { IContactUs, IContactUsRequest, TEntityId } from '@/types'

const BASE_ENDPOINT = '/contact'

export const getAllContactUs = async () => {
    const response = await APIService.get<IContactUs[]>(BASE_ENDPOINT)
    return response.data
}

export const createContactUs = async (contactData: IContactUsRequest) => {
    const response = await APIService.post<IContactUsRequest, IContactUs>(
        BASE_ENDPOINT,
        contactData
    )
    return response.data
}

export const deleteContactUs = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const updateContactUs = async (
    id: TEntityId,
    contactData: IContactUsRequest
) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    const response = await APIService.put<IContactUsRequest, IContactUs>(
        endpoint,
        contactData
    )
    return response.data
}

export const getContactUsById = async (id: TEntityId, preloads?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
            query: { preloads },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IContactUs>(url)
    return response.data
}
