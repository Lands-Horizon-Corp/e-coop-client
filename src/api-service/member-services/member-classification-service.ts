import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'

import {
    IMemberClassification,
    IMemberClassificationRequest,
    TEntityId,
} from '@/types'

const CrudServices = createAPICrudService<
    IMemberClassification,
    IMemberClassificationRequest
>(`/member-classification`)
const CollectionServices = createAPICollectionService<IMemberClassification>(
    `/member-classification`
)

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices

export const exportAllMemberClassifications = async (): Promise<void> => {
    const url = `/member-classification/export`
    await downloadFileService(url, 'all_member_classifications_export.csv')
}

export const exportFilteredMemberClassifications = async (
    filters?: string
): Promise<void> => {
    const url = qs.stringifyUrl(
        {
            url: `/member-classification/export-search`,
            query: { filters },
        },
        { skipNull: true }
    )
    await downloadFileService(url, 'filtered_member_classifications_export.csv')
}

export const exportSelectedMemberClassifications = async (
    ids: TEntityId[]
): Promise<void> => {
    if (ids.length === 0) {
        throw new Error('No member classification IDs provided for export.')
    }

    const query = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
    const url = `/member-classification/export-selected?${query}`

    await downloadFileService(url, 'selected_member_classifications_export.csv')
}

export default {
    ...CrudServices,
    ...CollectionServices,
    exportAllMemberClassifications,
    exportFilteredMemberClassifications,
    exportSelectedMemberClassifications,
}
