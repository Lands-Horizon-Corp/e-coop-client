import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IMemberOccupation,
    IMemberOccupationRequest,
} from './member-occupation.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberOccupation,
    IMemberOccupationRequest
>({
    url: '/api/v1/member-occupation',
    baseKey: 'member-occupation',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberOccupationAPI = apiCrudService

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
