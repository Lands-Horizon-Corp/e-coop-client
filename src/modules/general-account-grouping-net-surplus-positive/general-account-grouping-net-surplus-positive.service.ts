import { Logger } from '@/helpers/loggers'
import type {
    IGeneralAccountGroupingNetSurplusPositive,
    IGeneralAccountGroupingNetSurplusPositiveRequest,
} from '@/modules/general-account-grouping-net-surplus-positive'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generalAccountGroupingNetSurplusPositiveBaseKey,
} = createDataLayerFactory<
    IGeneralAccountGroupingNetSurplusPositive,
    IGeneralAccountGroupingNetSurplusPositiveRequest
>({
    url: '/api/v1/general-account-grouping-net-surplus-positive',
    baseKey: 'general-account-grouping-net-surplus-positive',
})

export const {
    API,
    route: generalAccountGroupingNetSurplusPositiveAPIRoute,

    create: createGeneralAccountGroupingNetSurplusPositive,
    updateById: updateGeneralAccountGroupingNetSurplusPositiveById,

    deleteById: deleteGeneralAccountGroupingNetSurplusPositiveById,
    deleteMany: deleteManyGeneralAccountGroupingNetSurplusPositive,

    getById: getGeneralAccountGroupingNetSurplusPositiveById,
    getAll: getAllGeneralAccountGroupingNetSurplusPositive,
    getPaginated: getPaginatedGeneralAccountGroupingNetSurplusPositive,
} = apiCrudService

export { generalAccountGroupingNetSurplusPositiveBaseKey }

export const {
    useCreate: useCreateGeneralAccountGroupingNetSurplusPositive,
    useUpdateById: useUpdateGeneralAccountGroupingNetSurplusPositiveById,

    useGetAll: useGetAllGeneralAccountGroupingNetSurplusPositive,
    useGetById: useGetGeneralAccountGroupingNetSurplusPositiveById,
    useGetPaginated: useGetPaginatedGeneralAccountGroupingNetSurplusPositive,

    useDeleteById: useDeleteGeneralAccountGroupingNetSurplusPositiveById,
    useDeleteMany: useDeleteManyGeneralAccountGroupingNetSurplusPositive,
} = apiCrudHooks

export const logger = Logger.getInstance(
    'general-account-grouping-net-surplus-positive'
)
