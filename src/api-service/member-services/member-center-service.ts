import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { downloadFileService } from '@/helpers'

import { IMemberCenter, IMemberCenterRequest, TEntityId } from '@/types'

const CrudServices = createAPICrudService<IMemberCenter, IMemberCenterRequest>(
    `/api/v1/member-center`
)
const CollectionServices = createAPICollectionService<IMemberCenter>(
    `/api/v1/member-center`
)

export const exportAllMemberCenters = async () => {
    const url = `/api/v1/member-center/export`
    await downloadFileService(url, 'all_member_center_export.csv')
}

export const exportSelectedMemberCenters = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No member type IDs provided for export.')
    }

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/member-center/export-selected`,
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
