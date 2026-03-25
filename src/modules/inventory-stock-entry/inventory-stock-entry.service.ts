import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventoryStockEntry,
    IInventoryStockEntryRequest,
} from '../inventory-stock-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryStockEntryBaseKey,
} = createDataLayerFactory<IInventoryStockEntry, IInventoryStockEntryRequest>({
    url: '/api/v1/inventory-stock-entry',
    baseKey: 'inventory-stock-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryStockEntryAPIRoute, // matches url above

    create: createInventoryStockEntry,
    updateById: updateInventoryStockEntryById,

    deleteById: deleteInventoryStockEntryById,
    deleteMany: deleteManyInventoryStockEntry,

    getById: getInventoryStockEntryById,
    getAll: getAllInventoryStockEntry,
    getPaginated: getPaginatedInventoryStockEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryStockEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryStockEntry,
    useUpdateById: useUpdateInventoryStockEntryById,

    useGetAll: useGetAllInventoryStockEntry,
    useGetById: useGetInventoryStockEntryById,
    useGetPaginated: useGetPaginatedInventoryStockEntry,

    useDeleteById: useDeleteInventoryStockEntryById,
    useDeleteMany: useDeleteManyInventoryStockEntry,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-stock-entry')
// custom hooks can go here
