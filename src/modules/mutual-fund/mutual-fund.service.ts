import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IMutualFund, IMutualFundRequest } from '../mutual-fund'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: mutualFundBaseKey,
} = createDataLayerFactory<IMutualFund, IMutualFundRequest>({
    url: '/api/v1/mutual-fund',
    baseKey: 'mutual-fund',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: mutualFundAPIRoute, // matches url above

    create: createMutualFund,
    updateById: updateMutualFundById,

    deleteById: deleteMutualFundById,
    deleteMany: deleteManyMutualFund,

    getById: getMutualFundById,
    getAll: getAllMutualFund,
    getPaginated: getPaginatedMutualFund,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { mutualFundBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateMutualFund,
    useUpdateById: useUpdateMutualFundById,

    useGetAll: useGetAllMutualFund,
    useGetById: useGetMutualFundById,
    useGetPaginated: useGetPaginatedMutualFund,

    useDeleteById: useDeleteMutualFundById,
    useDeleteMany: useDeleteManyMutualFund,
} = apiCrudHooks

export const logger = Logger.getInstance('mutual-fund')
// custom hooks can go here
