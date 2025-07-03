import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'
import qs from 'query-string'

import { IMemberGender, IMemberGenderRequest, TEntityId } from '@/types'

const CrudServices = createAPICrudService<IMemberGender, IMemberGenderRequest>(
    `/member-gender`
)

const CollectionServices =
    createAPICollectionService<IMemberGender>(`/member-gender`)

export const exportAll = async () => {
    const url = `/member-gender/export`
    await downloadFileService(url, 'all_genders_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = qs.stringifyUrl(
        {
            url: `/member-gender/export-search`,
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
    const url = qs.stringifyUrl(
        {
            url: `/member-gender/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_genders_export.xlsx')
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
