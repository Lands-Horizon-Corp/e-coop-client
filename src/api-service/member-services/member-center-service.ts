import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'
import qs from 'query-string'

import { IMemberCenter, IMemberCenterRequest, TEntityId } from '@/types'

const CrudServices = createAPICrudService<IMemberCenter, IMemberCenterRequest>(
    `/member-center`
)
const CollectionServices =
    createAPICollectionService<IMemberCenter>(`/member-center`)

export const exportAllMemberCenters = async () => {
    const url = `/member-center/export`
    await downloadFileService(url, 'all_member_center_export.csv')
}

export const exportSelectedMemberCenters = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No member type IDs provided for export.')
    }

    const url = qs.stringifyUrl(
        {
            url: `/member-center/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFileService(url, 'selected_member_center_export.csv')
}

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { allList, search } = CollectionServices
export default {
    ...CrudServices,
    ...CollectionServices,
    exportAllMemberCenters,
    exportSelectedMemberCenters,
}
