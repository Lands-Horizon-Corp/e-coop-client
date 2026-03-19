import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IInventoryWarehouse, IInventoryWarehouseRequest } from '.'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryWarehouseBaseKey,
} = createDataLayerFactory<IInventoryWarehouse, IInventoryWarehouseRequest>({
    url: '/api/v1/inventory-warehouse',
    baseKey: 'inventory-warehouse',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryWarehouseAPIRoute, // matches url above

    create: createInventoryWarehouse,
    updateById: updateInventoryWarehouseById,

    deleteById: deleteInventoryWarehouseById,
    deleteMany: deleteManyInventoryWarehouse,

    getById: getInventoryWarehouseById,
    getAll: getAllInventoryWarehouse,
    getPaginated: getPaginatedInventoryWarehouse,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
// custom service functions can go here
// 🪝 HOOK STARTS HERE
export { inventoryWarehouseBaseKey } // Exported in case it's needed outside
// Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryWarehouse,
    useUpdateById: useUpdateInventoryWarehouseById,

    useGetAll: useGetAllInventoryWarehouse,
    useGetById: useGetInventoryWarehouseById,
    useGetPaginated: useGetPaginatedInventoryWarehouse,

    useDeleteById: useDeleteInventoryWarehouseById,
    useDeleteMany: useDeleteManyInventoryWarehouse,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-warehouse')
// custom hooks can go here
