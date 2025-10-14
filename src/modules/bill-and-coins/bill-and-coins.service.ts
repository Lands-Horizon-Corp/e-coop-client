import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IBillsAndCoin,
    IBillsAndCoinRequest,
} from './bill-and-coins.types'

const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
    IBillsAndCoin,
    IBillsAndCoinRequest
>({
    url: '/api/v1/bills-and-coins',
    baseKey: 'bills-and-coins',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API: billsAndCoinsAPI,
    route: billsAndCoinsAPIRoute,

    create: createBillsAndCoins,
    updateById: updateBillsAndCoinsById,

    deleteById: deleteBillsAndCoinsById,
    deleteMany: deleteManyBillsAndCoins,

    getById: getBillsAndCoinsById,
    getAll: getAllBillsAndCoins,
    getPaginated: getPaginatedBillsAndCoins,
} = apiCrudService

// 🪝 HOOK STARTS HERE
export { baseQueryKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateBillsAndCoins,
    useDeleteById: useDeleteBillsAndCoinsById,
    useDeleteMany: useDeleteManyBillsAndCoins,
    useGetAll: useGetAllBillsAndCoins,
    useGetById: useGetBillsAndCoinsById,
    useGetPaginated: useGetPaginatedBillsAndCoins,
    useUpdateById: useUpdateBillsAndCoinsById,
} = apiCrudHooks

export const logger = Logger.getInstance('bills-and-coins')
