import { Logger } from '@/helpers/loggers'
import type {
    IInterestRateScheme,
    IInterestRateSchemeRequest,
} from '@/modules/interest-rate-scheme'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: interestRateSchemeBaseKey,
} = createDataLayerFactory<IInterestRateScheme, IInterestRateSchemeRequest>({
    url: '/api/v1/interest-rate-scheme',
    baseKey: 'interest-rate-scheme',
})

export const {
    API,
    route: interestRateSchemeAPIRoute,

    create: createInterestRateScheme,
    updateById: updateInterestRateSchemeById,

    deleteById: deleteInterestRateSchemeById,
    deleteMany: deleteManyInterestRateScheme,

    getById: getInterestRateSchemeById,
    getAll: getAllInterestRateScheme,
    getPaginated: getPaginatedInterestRateScheme,
} = apiCrudService

export { interestRateSchemeBaseKey }

export const {
    useCreate: useCreateInterestRateScheme,
    useUpdateById: useUpdateInterestRateSchemeById,

    useGetAll: useGetAllInterestRateScheme,
    useGetById: useGetInterestRateSchemeById,
    useGetPaginated: useGetPaginatedInterestRateScheme,

    useDeleteById: useDeleteInterestRateSchemeById,
    useDeleteMany: useDeleteManyInterestRateScheme,
} = apiCrudHooks

export const logger = Logger.getInstance('interest-rate-scheme')
