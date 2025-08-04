import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IFootstep, TEntityId } from '@/types'

import { downloadFile } from '../helpers'

export const exportAll = async (url: string) => {
    return downloadFile(`/api/v1/footstep/${url}`, 'all_footsteps_export.csv')
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
            url: `/api/v1/footstep/${url}`,
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
            url: `/api/v1/footstep/${url}/export-selected?`,
            query: { ids },
        },
        { skipNull: true }
    )

    return downloadFile(finalUrl, 'selected_footsteps_export.csv')
}

const CrudServices = createAPICrudService<IFootstep, unknown>(
    '/api/v1/footstep'
)
const CollectionServices =
    createAPICollectionService<IFootstep>('/api/v1/footstep')

export const { getById, updateById, deleteById, deleteMany } = CrudServices
export const { allList, search } = CollectionServices
export default { ...CrudServices, ...CollectionServices }
