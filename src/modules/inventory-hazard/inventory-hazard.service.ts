import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInventoryHazard,
    IInventoryHazardRequest,
} from '../inventory-hazard'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryHazardBaseKey,
} = createDataLayerFactory<IInventoryHazard, IInventoryHazardRequest>({
    url: '/api/v1/inventory-hazard',
    baseKey: 'inventory-hazard',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: inventoryHazardAPIRoute, // matches url above

    create: createInventoryHazard,
    updateById: updateInventoryHazardById,

    deleteById: deleteInventoryHazardById,
    deleteMany: deleteManyInventoryHazard,

    getById: getInventoryHazardById,
    getAll: getAllInventoryHazard,
    getPaginated: getPaginatedInventoryHazard,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { inventoryHazardBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInventoryHazard,
    useUpdateById: useUpdateInventoryHazardById,

    useGetAll: useGetAllInventoryHazard,
    useGetById: useGetInventoryHazardById,
    useGetPaginated: useGetPaginatedInventoryHazard,

    useDeleteById: useDeleteInventoryHazardById,
    useDeleteMany: useDeleteManyInventoryHazard,
} = apiCrudHooks

export const logger = Logger.getInstance('inventory-hazard')
// custom hooks can go here
