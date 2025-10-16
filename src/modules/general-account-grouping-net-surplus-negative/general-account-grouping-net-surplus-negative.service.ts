import { Logger } from '@/helpers/loggers'
import type {
    IGeneralAccountGroupingNetSurplusNegative,
    IGeneralAccountGroupingNetSurplusNegativeRequest,
} from '@/modules/general-account-grouping-net-surplus-negative'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generalAccountGroupingNetSurplusNegativeBaseKey,
} = createDataLayerFactory<
    IGeneralAccountGroupingNetSurplusNegative,
    IGeneralAccountGroupingNetSurplusNegativeRequest
>({
    url: '/api/v1/general-account-grouping-net-surplus-negative',
    baseKey: 'general-account-grouping-net-surplus-negative',
})

export const {
    API,
    route: generalAccountGroupingNetSurplusNegativeAPIRoute,

    create: createGeneralAccountGroupingNetSurplusNegative,
    updateById: updateGeneralAccountGroupingNetSurplusNegativeById,

    deleteById: deleteGeneralAccountGroupingNetSurplusNegativeById,
    deleteMany: deleteManyGeneralAccountGroupingNetSurplusNegative,

    getById: getGeneralAccountGroupingNetSurplusNegativeById,
    getAll: getAllGeneralAccountGroupingNetSurplusNegative,
    getPaginated: getPaginatedGeneralAccountGroupingNetSurplusNegative,
} = apiCrudService

export { generalAccountGroupingNetSurplusNegativeBaseKey }

export const {
    useCreate: useCreateGeneralAccountGroupingNetSurplusNegative,
    useUpdateById: useUpdateGeneralAccountGroupingNetSurplusNegativeById,

    useGetAll: useGetAllGeneralAccountGroupingNetSurplusNegative,
    useGetById: useGetGeneralAccountGroupingNetSurplusNegativeById,
    useGetPaginated: useGetPaginatedGeneralAccountGroupingNetSurplusNegative,

    useDeleteById: useDeleteGeneralAccountGroupingNetSurplusNegativeById,
    useDeleteMany: useDeleteManyGeneralAccountGroupingNetSurplusNegative,
} = apiCrudHooks

export const logger = Logger.getInstance(
    'general-account-grouping-net-surplus-negative'
)
