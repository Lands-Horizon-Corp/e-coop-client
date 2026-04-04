import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventoryEntry,
    IInventoryEntryRequest,
} from '../inventory-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryEntryBaseKey,
} = createDataLayerFactory<IInventoryEntry, IInventoryEntryRequest>({
    url: '/api/v1/inventory-entry',
    baseKey: 'inventory-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryEntryAPIRoute, // matches url above

    create: createInventoryEntry,
    updateById: updateInventoryEntryById,

    deleteById: deleteInventoryEntryById,
    deleteMany: deleteManyInventoryEntry,

    getById: getInventoryEntryById,
    getAll: getAllInventoryEntry,
    getPaginated: getPaginatedInventoryEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryEntry,
    useUpdateById: useUpdateInventoryEntryById,

    useGetAll: useGetAllInventoryEntry,
    useGetById: useGetInventoryEntryById,
    useGetPaginated: useGetPaginatedInventoryEntry,

    useDeleteById: useDeleteInventoryEntryById,
    useDeleteMany: useDeleteManyInventoryEntry,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-entry')
// custom hooks can go here
