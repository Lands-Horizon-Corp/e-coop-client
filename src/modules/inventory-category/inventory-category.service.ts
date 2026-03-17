import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventoryCategory,
    IInventoryCategoryRequest,
} from '../inventory-category'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryCategoryBaseKey,
} = createDataLayerFactory<IInventoryCategory, IInventoryCategoryRequest>({
    url: '/api/v1/inventory-category',
    baseKey: 'inventory-category',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryCategoryAPIRoute, // matches url above

    create: createInventoryCategory,
    updateById: updateInventoryCategoryById,

    deleteById: deleteInventoryCategoryById,
    deleteMany: deleteManyInventoryCategory,

    getById: getInventoryCategoryById,
    getAll: getAllInventoryCategory,
    getPaginated: getPaginatedInventoryCategory,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryCategoryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryCategory,
    useUpdateById: useUpdateInventoryCategoryById,

    useGetAll: useGetAllInventoryCategory,
    useGetById: useGetInventoryCategoryById,
    useGetPaginated: useGetPaginatedInventoryCategory,

    useDeleteById: useDeleteInventoryCategoryById,
    useDeleteMany: useDeleteManyInventoryCategory,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-category')
// custom hooks can go here
