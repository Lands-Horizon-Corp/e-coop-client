import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'

import {
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentRequest,
    TEntityId,
} from '@/types'

const CrudServices = createAPICrudService<
    IMemberEducationalAttainment,
    IMemberEducationalAttainmentRequest
>(`/member-educational-attainment`)

const CollectionServices =
    createAPICollectionService<IMemberEducationalAttainment>(
        `/member-educational-attainment`
    )

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices

export const exportAll = async () => {
    const url = `/member-educational-attainment/export`
    return downloadFileService(
        url,
        'all_member_educational_attainments_export.csv'
    )
}

export const exportAllFiltered = async (filters?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `/member-educational-attainment/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    return downloadFileService(
        url,
        'filtered_member_educational_attainments_export.csv'
    )
}

export const exportSelected = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error(
            'No member educational attainment IDs provided for export.'
        )
    }
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `/member-educational-attainment/export-selected?${query}`
    return downloadFileService(
        url,
        'selected_member_educational_attainments_export.csv'
    )
}

export default {
    ...CrudServices,
    ...CollectionServices,
    exportAll,
    exportSelected,
    exportAllFiltered,
}
