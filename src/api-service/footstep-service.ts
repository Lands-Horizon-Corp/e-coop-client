import qs from 'query-string'

import APIService from './api-service'
import { downloadFile } from '../helpers'

import { IFootstepPaginated, TEntityId } from '@/types'

export const exportAll = async (url: string) => {
    return downloadFile(`/footstep/${url}`, 'all_footsteps_export.csv')
}

export const exportAllFiltered = async (props: {
    url: string
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { url, filters, pagination, sort } = props || {}

    const finalUrl = qs.stringifyUrl(
        {
            url: `/footstep/${url}`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    return downloadFile(finalUrl, 'filtered_footsteps_export.csv')
}

export const exportSelected = async (url: string, ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No footstep IDs provided for export.')
    }

    const finalUrl = qs.stringifyUrl(
        {
            url: `/footstep/${url}/export-selected?`,
            query: { ids },
        },
        { skipNull: true }
    )

    return downloadFile(finalUrl, 'selected_footsteps_export.csv')
}

export const getPaginatedFootsteps = async (props: {
    url: string
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { url, filters, pagination, sort } = props || {}

    const finalUrl = qs.stringifyUrl(
        {
            url: `/footstep/${url}`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    return APIService.get<IFootstepPaginated>(finalUrl).then((res) => res.data)
}
