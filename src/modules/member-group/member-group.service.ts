import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IMemberGroup, IMemberGroupRequest } from './member-group.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberGroup,
    IMemberGroupRequest
>({
    url: '/api/v1/member-group',
    baseKey: 'member-group',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberGroupAPI = apiCrudService

// 🪝 HOOK STARTS HERE
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

export const logger = Logger.getInstance('member-group')
