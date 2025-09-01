import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IPermission, IPermissionRequest } from '../permission'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: permissionBaseKey,
} = createDataLayerFactory<IPermission, IPermissionRequest>({
    url: '/api/v1/permission',
    baseKey: 'permission',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: permissionAPIRoute, // matches url above

    create: createPermission,
    updateById: updatePermissionById,

    deleteById: deletePermissionById,
    deleteMany: deleteManyPermissions,

    getById: getPermissionById,
    getAll: getAllPermissions,
    getPaginated: getPaginatedPermissions,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { permissionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreatePermission,
    useUpdateById: useUpdatePermissionById,

    useGetAll: useGetAllPermissions,
    useGetById: useGetPermissionById,
    useGetPaginated: useGetPaginatedPermissions,

    useDeleteById: useDeletePermissionById,
    useDeleteMany: useDeleteManyPermissions,
} = apiCrudHooks

// custom hooks can go here
