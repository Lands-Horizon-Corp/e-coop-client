import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IUserBase } from './user.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IUserBase,
    void
>({
    url: '/api/v1/user',
    baseKey: 'user',
})

// ⚙️🛠️ API SERVICE HERE
export const UserAPI = apiCrudService

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
