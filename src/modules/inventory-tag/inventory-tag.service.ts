import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IInventoryTag, IInventoryTagRequest } from '../inventory-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryTagBaseKey,
} = createDataLayerFactory<IInventoryTag, IInventoryTagRequest>({
    url: '/api/v1/inventory-tag',
    baseKey: 'inventory-tag',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryTagAPIRoute, // matches url above

    create: createInventoryTag,
    updateById: updateInventoryTagById,

    deleteById: deleteInventoryTagById,
    deleteMany: deleteManyInventoryTag,

    getById: getInventoryTagById,
    getAll: getAllInventoryTag,
    getPaginated: getPaginatedInventoryTag,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryTagBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryTag,
    useUpdateById: useUpdateInventoryTagById,

    useGetAll: useGetAllInventoryTag,
    useGetById: useGetInventoryTagById,
    useGetPaginated: useGetPaginatedInventoryTag,

    useDeleteById: useDeleteInventoryTagById,
    useDeleteMany: useDeleteManyInventoryTag,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-tag')
// custom hooks can go here
