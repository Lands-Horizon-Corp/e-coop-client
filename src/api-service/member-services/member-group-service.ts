import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'

import { IMemberGroup, IMemberGroupRequest, TEntityId } from '@/types'

const CrudServices = createAPICrudService<IMemberGroup, IMemberGroupRequest>(
    `/api/v1/member-group`
)

const CollectionServices =
    createAPICollectionService<IMemberGroup>(`/api/v1/member-group`)

export const exportAll = async () => {
    const url = `/api/v1/member-group/export`
    return downloadFileService(url, 'all_group_export.csv')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-group/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    return downloadFileService(url, 'filtered_member_group_export.csv')
}

export const exportSelected = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error(
            'No member educational attainment IDs provided for export.'
        )
    }
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `/api/v1/member-group/export-selected?${query}`
    return downloadFileService(url, 'selected_member_group_export.csv')
}

export const exportCurrentPage = async (page: number) => {
    const url = `/api/v1/member-group/export-current-page/${page}`
    await downloadFileService(
        url,
        `current_page_member_group_${page}_export.xlsx`
    )
}

export const { allList, search } = CollectionServices
export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices

export default {
    ...CrudServices,
    ...CollectionServices,
    exportAll,
    exportSelected,
    exportAllFiltered,
}
