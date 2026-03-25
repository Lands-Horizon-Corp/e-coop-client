import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventorySupplier,
    IInventorySupplierRequest,
} from '../inventory-supplier'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventorySupplierBaseKey,
} = createDataLayerFactory<IInventorySupplier, IInventorySupplierRequest>({
    url: '/api/v1/inventory-supplier',
    baseKey: 'inventory-supplier',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventorySupplierAPIRoute, // matches url above

    create: createInventorySupplier,
    updateById: updateInventorySupplierById,

    deleteById: deleteInventorySupplierById,
    deleteMany: deleteManyInventorySupplier,

    getById: getInventorySupplierById,
    getAll: getAllInventorySupplier,
    getPaginated: getPaginatedInventorySupplier,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventorySupplierBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventorySupplier,
    useUpdateById: useUpdateInventorySupplierById,

    useGetAll: useGetAllInventorySupplier,
    useGetById: useGetInventorySupplierById,
    useGetPaginated: useGetPaginatedInventorySupplier,

    useDeleteById: useDeleteInventorySupplierById,
    useDeleteMany: useDeleteManyInventorySupplier,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-supplier')
// custom hooks can go here
