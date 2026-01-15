import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IMutualFundTable,
    IMutualFundTableRequest,
} from '../mutual-fund-table'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: mutualFundTableBaseKey,
} = createDataLayerFactory<IMutualFundTable, IMutualFundTableRequest>({
    url: '/api/v1/mutual-fund-table',
    baseKey: 'mutual-fund-table',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: mutualFundTableAPIRoute, // matches url above

    create: createMutualFundTable,
    updateById: updateMutualFundTableById,

    deleteById: deleteMutualFundTableById,
    deleteMany: deleteManyMutualFundTable,

    getById: getMutualFundTableById,
    getAll: getAllMutualFundTable,
    getPaginated: getPaginatedMutualFundTable,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { mutualFundTableBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateMutualFundTable,
    useUpdateById: useUpdateMutualFundTableById,

    useGetAll: useGetAllMutualFundTable,
    useGetById: useGetMutualFundTableById,
    useGetPaginated: useGetPaginatedMutualFundTable,

    useDeleteById: useDeleteMutualFundTableById,
    useDeleteMany: useDeleteManyMutualFundTable,
} = apiCrudHooks

export const logger = Logger.getInstance('mutual-fund-table')
// custom hooks can go here
