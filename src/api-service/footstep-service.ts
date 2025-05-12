import qs from 'query-string'

import APIService from './api-service'
import { downloadFile } from '../helpers'

import { IFootstepPaginated, TEntityId } from '@/types'

const BASE_ENDPOINT = '/footstep'

export const getFootstepById = async (
    footstepId: TEntityId,
    preloads: string[] = [
        'Admin',
        'Admin.Media',
        'Employee',
        'Employee.Media',
        'Owner',
        'Owner.Media',
        'Member',
        'Member.Media',
    ]
) => {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/${footstepId}`,
            query: { preloads },
        },
        { skipNull: true }
    )
    return APIService.get<IFootstepPaginated>(url).then((res) => res.data)
}

export const exportAll = async () => {
    const url = `${BASE_ENDPOINT}/export`
    return downloadFile(url, 'all_footsteps_export.csv')
}

export const exportAllFiltered = async (filters?: string) => {
    const filterQuery = filters ? `filter=${encodeURIComponent(filters)}` : ''
    const url = `${BASE_ENDPOINT}/export-search${filterQuery ? `?${filterQuery}` : ''}`
    return downloadFile(url, 'filtered_footsteps_export.csv')
}

export const exportSelected = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No footstep IDs provided for export.')
    }

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/export-selected?`,
            query: { ids },
        },
        { skipNull: true }
    )

    return downloadFile(url, 'selected_footsteps_export.csv')
}

export const getFootstepsTeam = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}/team`,
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

    return APIService.get<IFootstepPaginated>(url).then((res) => res.data)
}

export const getFootsteps = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `${BASE_ENDPOINT}`,
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

    return APIService.get<IFootstepPaginated>(url).then((res) => res.data)
}
