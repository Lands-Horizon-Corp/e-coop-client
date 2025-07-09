import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'

import { IMemberOccupation, IMemberOccupationRequest, TEntityId } from '@/types'

const CrudServices = createAPICrudService<
    IMemberOccupation,
    IMemberOccupationRequest
>(`/member-occupation`)

const CollectionServices =
    createAPICollectionService<IMemberOccupation>(`/member-occupation`)

export const exportAll = async () => {
    const url = `/member-occupation/export`
    await downloadFileService(url, 'all_member_occupations_export.csv')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `/member-occupation/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    await downloadFileService(url, 'filtered_member_occupations_export.csv')
}

export const exportSelected = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No member occupation IDs provided for export.')
    }
    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `/member-occupation/export-selected?${query}`
    await downloadFileService(url, 'selected_member_occupations_export.csv')
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
