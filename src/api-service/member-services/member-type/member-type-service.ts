import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'

import { IMemberType, IMemberTypeRequest, TEntityId } from '@/types'

const CrudServices = createAPICrudService<IMemberType, IMemberTypeRequest>(
    '/api/v1/member-type'
)

const CollectionServices =
    createAPICollectionService<IMemberType>(`/api/v1/member-type`)

export const exportAll = async (): Promise<void> => {
    const url = `/api/v1/member-type/export`
    await downloadFileService(url, 'all_member_types_export.csv')
}

export const exportSelected = async (ids: TEntityId[]): Promise<void> => {
    if (ids.length === 0) {
        throw new Error('No member type IDs provided for export.')
    }

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-type/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_member_types_export.csv')
}

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default {
    ...CrudServices,
    ...CollectionServices,
    exportAll,
    exportSelected,
}
