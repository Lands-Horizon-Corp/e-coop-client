import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IMutualAidContribution,
    IMutualAidContributionRequest,
} from '../mutual-aid-contribution'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: mutualAidContributionBaseKey,
} = createDataLayerFactory<
    IMutualAidContribution,
    IMutualAidContributionRequest
>({
    url: '/api/v1/mutual-aid-contribution',
    baseKey: 'mutual-aid-contribution',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: mutualAidContributionAPIRoute, // matches url above

    create: createMutualAidContribution,
    updateById: updateMutualAidContributionById,

    deleteById: deleteMutualAidContributionById,
    deleteMany: deleteManyMutualAidContribution,

    getById: getMutualAidContributionById,
    getAll: getAllMutualAidContribution,
    getPaginated: getPaginatedMutualAidContribution,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { mutualAidContributionBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateMutualAidContribution,
    useUpdateById: useUpdateMutualAidContributionById,

    useGetAll: useGetAllMutualAidContribution,
    useGetById: useGetMutualAidContributionById,
    useGetPaginated: useGetPaginatedMutualAidContribution,

    useDeleteById: useDeleteMutualAidContributionById,
    useDeleteMany: useDeleteManyMutualAidContribution,
} = apiCrudHooks

export const logger = Logger.getInstance('mutual-aid-contribution')
// custom hooks can go here
