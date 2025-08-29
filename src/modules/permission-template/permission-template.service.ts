import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IPermissionTemplate, IPermissionTemplateRequest } from '../permission-template'

const { apiCrudHooks, apiCrudService, baseQueryKey : permissionTemplateBaseKey } = createDataLayerFactory<
    IPermissionTemplate,
    IPermissionTemplateRequest
>({
    url: '/api/v1/permission-template',
    baseKey: 'permission-template',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: permissionTemplateAPIRoute, // matches url above

    create: createPermissionTemplate,
    updateById: updatePermissionTemplateById,

    deleteById: deletePermissionTemplateById,
    deleteMany: deleteManyPermissionTemplates,

    getById: getPermissionTemplateById,
    getAll: getAllPermissionTemplates,
    getPaginated: getPaginatedPermissionTemplates,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { permissionTemplateBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreatePermissionTemplate,
    useUpdateById: useUpdatePermissionTemplateById,

    useGetAll: useGetAllPermissionTemplates,
    useGetById: useGetPermissionTemplateById,
    useGetPaginated: useGetPaginatedPermissionTemplates,

    useDeleteById: useDeletePermissionTemplateById,
    useDeleteMany: useDeleteManyPermissionTemplates,
} = apiCrudHooks

// custom hooks can go here
