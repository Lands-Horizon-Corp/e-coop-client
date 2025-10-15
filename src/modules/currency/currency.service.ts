import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { ICurrency, ICurrencyRequest } from '../currency'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: currencyBaseKey,
} = createDataLayerFactory<ICurrency, ICurrencyRequest>({
    url: '/api/v1/currency',
    baseKey: 'currency',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: currencyAPIRoute, // matches url above

    create: createCurrency,
    updateById: updateCurrencyById,

    deleteById: deleteCurrencyById,
    deleteMany: deleteManyCurrency,

    getById: getCurrencyById,
    getAll: getAllCurrency,
    getPaginated: getPaginatedCurrency,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { currencyBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateCurrency,
    useUpdateById: useUpdateCurrencyById,

    useGetAll: useGetAllCurrency,
    useGetById: useGetCurrencyById,
    useGetPaginated: useGetPaginatedCurrency,

    useDeleteById: useDeleteCurrencyById,
    useDeleteMany: useDeleteManyCurrency,
} = apiCrudHooks

// custom hooks can go here
