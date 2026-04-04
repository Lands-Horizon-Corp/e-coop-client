import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventoryStock,
    IInventoryStockRequest,
} from '../inventory-stock'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryStockBaseKey,
} = createDataLayerFactory<IInventoryStock, IInventoryStockRequest>({
    url: '/api/v1/inventory-stock',
    baseKey: 'inventory-stock',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryStockAPIRoute, // matches url above

    create: createInventoryStock,
    updateById: updateInventoryStockById,

    deleteById: deleteInventoryStockById,
    deleteMany: deleteManyInventoryStock,

    getById: getInventoryStockById,
    getAll: getAllInventoryStock,
    getPaginated: getPaginatedInventoryStock,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryStockBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryStock,
    useUpdateById: useUpdateInventoryStockById,

    useGetAll: useGetAllInventoryStock,
    useGetById: useGetInventoryStockById,
    useGetPaginated: useGetPaginatedInventoryStock,

    useDeleteById: useDeleteInventoryStockById,
    useDeleteMany: useDeleteManyInventoryStock,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-stock')
// custom hooks can go here
