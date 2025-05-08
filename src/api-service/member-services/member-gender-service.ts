import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IMemberGenderRequest,
    IMemberGender,
    IMemberGenderPaginated,
} from '@/types'

const BASE_ENDPOINT = '/gender'

export const getAllMemberGenders = async () => {
    const response = await APIService.get<IMemberGender[]>(BASE_ENDPOINT)
    return response.data
}

export const createMemberGender = async (genderData: IMemberGenderRequest) => {
    const response = await APIService.post<IMemberGenderRequest, IMemberGender>(
        BASE_ENDPOINT,
        genderData
    )
    return response.data
}

export const deleteMemberGender = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const updateMemberGender = async (
    id: TEntityId,
    genderData: IMemberGenderRequest
) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    const response = await APIService.put<IMemberGenderRequest, IMemberGender>(
        endpoint,
        genderData
    )
    return response.data
}

export const getMemberGenderById = async (id: TEntityId) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${id}`,
        },
        { skipNull: true }
    )
    const response = await APIService.get<IMemberGender>(url)
    return response.data
}

export const getPaginatedMemberGenders = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/search`,
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

    const response = await APIService.get<IMemberGenderPaginated>(url)
    return response.data
}

export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }
    await APIService.delete<void>(endpoint, payload)
}

export const exportAll = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_genders_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${BASE_ENDPOINT}/export-search?filter=${filters || ''}`
    await downloadFileService(url, 'filtered_genders_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_genders_export.xlsx')
}

export const exportCurrentPage = async (page: number) => {
    const url = `${BASE_ENDPOINT}/export-current-page/${page}`
    await downloadFileService(url, `current_page_genders_${page}_export.xlsx`)
}
