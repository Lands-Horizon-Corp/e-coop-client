import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventoryBrand,
    IInventoryBrandRequest,
} from '../inventory-brand'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryBrandBaseKey,
} = createDataLayerFactory<IInventoryBrand, IInventoryBrandRequest>({
    url: '/api/v1/inventory-brand',
    baseKey: 'inventory-brand',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryBrandAPIRoute, // matches url above

    create: createInventoryBrand,
    updateById: updateInventoryBrandById,

    deleteById: deleteInventoryBrandById,
    deleteMany: deleteManyInventoryBrand,

    getById: getInventoryBrandById,
    getAll: getAllInventoryBrand,
    getPaginated: getPaginatedInventoryBrand,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryBrandBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryBrand,
    useUpdateById: useUpdateInventoryBrandById,

    useGetAll: useGetAllInventoryBrand,
    useGetById: useGetInventoryBrandById,
    useGetPaginated: useGetPaginatedInventoryBrand,

    useDeleteById: useDeleteInventoryBrandById,
    useDeleteMany: useDeleteManyInventoryBrand,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-brand')
// custom hooks can go here
