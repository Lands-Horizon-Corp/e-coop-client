import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import type { IInventoryUnifiedStockRequest } from '../inventory'
import { IInventoryEntry } from '../inventory-entry'
import { IInventoryItem } from '../inventory-item'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: inventoryBaseKey,
} = createDataLayerFactory<IInventoryItem, IInventoryUnifiedStockRequest>({
    url: '/api/v1/inventory-item',
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

// 📥 STOCK IN
export const stockInInventory = async (
    payload: IInventoryUnifiedStockRequest
) => {
    const { data } = await API.post<
        IInventoryUnifiedStockRequest,
        IInventoryEntry
    >(`${inventoryAPIRoute}/stock-in`, payload)
    return data
}

// 📤 STOCK OUT
export const stockOutInventory = async (
    payload: IInventoryUnifiedStockRequest
) => {
    const { data } = await API.post<
        IInventoryUnifiedStockRequest,
        IInventoryEntry
    >(`${inventoryAPIRoute}/stock-out`, payload)
    return data
}

// 🔍 LOOKUP
export const lookupInventoryByBarcode = async (barcode: string) => {
    const { data } = await API.get(`${inventoryAPIRoute}/lookup`, {
        params: { barcode },
    })
    return data
}

// 🔄 TRANSITION
export const transitionInventoryEntry = async (payload: {
    entryId: string
    direction: 'forward' | 'backward' | 'cancel' | 'missing'
    flow: 'in' | 'out'
}) => {
    const { data } = await API.post(`${inventoryAPIRoute}/transition`, payload)
    return data
}

export const useStockInInventory = createMutationFactory<
    IInventoryEntry,
    Error,
    IInventoryUnifiedStockRequest
>({
    mutationFn: stockInInventory,
    defaultInvalidates: [
        [inventoryBaseKey, 'all'],
        [inventoryBaseKey, 'paginated'],
    ],
})

export const useStockOutInventory = createMutationFactory<
    IInventoryEntry,
    Error,
    IInventoryUnifiedStockRequest
>({
    mutationFn: stockOutInventory,
    defaultInvalidates: [
        [inventoryBaseKey, 'all'],
        [inventoryBaseKey, 'paginated'],
    ],
})
export const logger = Logger.getInstance('inventory')
// custom hooks can go here
