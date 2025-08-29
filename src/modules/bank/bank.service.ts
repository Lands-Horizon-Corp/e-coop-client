import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IBank, IBankRequest } from '../bank'

const { apiCrudHooks, apiCrudService, baseQueryKey } = createDataLayerFactory<
    IBank,
    IBankRequest
>({
    url: '/api/v1/bank',
    baseKey: 'bank',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // most of time di to nagagamit, pag nag raw lang tlga
    route: bankAPIRoute, // same sa url na prinovide mo sa createDataLayerFactory

    create: createBank,
    updateById: updateBankById,

    deleteById: deleteBankById,
    deleteMany: deleteManyBanks,

    getById: getBankById,
    getAll: getAllBanks,
    getPaginated: getPaginatedBanks,
} = apiCrudService

// write ur custom api service here and export it

// 🪝 HOOK STARTS HERE
export { baseQueryKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateBank,
    useUpdateById: useUpdateBankById,

    useGetAll: useGetAllBanks,
    useGetById: useGetBankById,
    useGetPaginated: useGetPaginatedBanks,

    useDeleteById: useDeleteBankById,
    useDeleteMany: useDeleteManyBanks,
} = apiCrudHooks

// write ur custom hook here and export it
