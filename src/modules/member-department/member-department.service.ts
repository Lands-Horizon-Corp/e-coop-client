import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IMemberDepartment,
    IMemberDepartmentRequest,
} from './member-department.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberDepartment,
    IMemberDepartmentRequest
>({
    url: '/api/v1/member-department',
    baseKey: 'member-department',
})

// ⚙️🛠️ API SERVICE HERE
export const MemberDepartmentAPI = apiCrudService

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
