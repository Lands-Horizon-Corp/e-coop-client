import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IInventoryItem, IInventoryItemRequest } from '../inventory-item'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryItemBaseKey,
} = createDataLayerFactory<IInventoryItem, IInventoryItemRequest>({
    url: '/api/v1/inventory-item',
    baseKey: 'inventory-item',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryItemAPIRoute, // matches url above

    create: createInventoryItem,
    updateById: updateInventoryItemById,

    deleteById: deleteInventoryItemById,
    deleteMany: deleteManyInventoryItem,

    getById: getInventoryItemById,
    getAll: getAllInventoryItem,
    getPaginated: getPaginatedInventoryItem,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryItemBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryItem,
    useUpdateById: useUpdateInventoryItemById,

    useGetAll: useGetAllInventoryItem,
    useGetById: useGetInventoryItemById,
    useGetPaginated: useGetPaginatedInventoryItem,

    useDeleteById: useDeleteInventoryItemById,
    useDeleteMany: useDeleteManyInventoryItem,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-item')
// custom hooks can go here
