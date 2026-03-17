import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IInventory, IInventoryRequest } from '../inventory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryBaseKey,
} = createDataLayerFactory<IInventory, IInventoryRequest>({
    url: '/api/v1/inventory',
    baseKey: 'inventory',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryAPIRoute, // matches url above

    create: createInventory,
    updateById: updateInventoryById,

    deleteById: deleteInventoryById,
    deleteMany: deleteManyInventory,

    getById: getInventoryById,
    getAll: getAllInventory,
    getPaginated: getPaginatedInventory,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventory,
    useUpdateById: useUpdateInventoryById,

    useGetAll: useGetAllInventory,
    useGetById: useGetInventoryById,
    useGetPaginated: useGetPaginatedInventory,

    useDeleteById: useDeleteInventoryById,
    useDeleteMany: useDeleteManyInventory,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory')
// custom hooks can go here
