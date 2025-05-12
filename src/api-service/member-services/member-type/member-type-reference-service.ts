import qs from 'query-string'
import APIService from '../../api-service'

import {
    TEntityId,
    IMemberTypeReference,
    IMemberTypeReferenceRequest,
    IMemberTypeReferencePaginated,
} from '@/types'

const BASE_ENDPOINT = '/member-type-reference'

export const getMemberTypeReferenceById = async (
    id: TEntityId,
    preloads?: string[]
): Promise<IMemberTypeReference> => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
        query: { preloads },
    })

    const response = await APIService.get<IMemberTypeReference>(url)
    return response.data
}

export const createMemberTypeReference = async (
    data: IMemberTypeReferenceRequest,
    preloads?: string[]
): Promise<IMemberTypeReference> => {
    const url = qs.stringifyUrl(
        {
            url: BASE_ENDPOINT,
            query: { preloads },
        },
        { skipNull: true }
    )

    const response = await APIService.post<
        IMemberTypeReferenceRequest,
        IMemberTypeReference
    >(url, data)

    return response.data
}

export const deleteMemberTypeReference = async (
    id: TEntityId
): Promise<void> => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const updateMemberTypeReference = async (
    id: TEntityId,
    data: IMemberTypeReferenceRequest,
    preloads?: string[]
): Promise<IMemberTypeReference> => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
        query: { preloads },
    })

    const response = await APIService.put<
        IMemberTypeReferenceRequest,
        IMemberTypeReference
    >(url, data)

    return response.data
}

export const getPaginatedMemberTypeReferences = async (props?: {
    memberTypeId: string
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}): Promise<IMemberTypeReferencePaginated> => {
    const { memberTypeId, filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${memberTypeId}`,
            query: {
                sort,
                preloads,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IMemberTypeReferencePaginated>(url)
    return response.data
}

export const deleteManyMemberTypeReferences = async (
    ids: TEntityId[]
): Promise<void> => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
