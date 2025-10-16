import { Logger } from '@/helpers/loggers'
import type {
    IOrganizationDailyUsage,
    IOrganizationDailyUsageRequest,
} from '@/modules/orgnaization-daily-usage'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: organizationDailyUsageBaseKey,
} = createDataLayerFactory<
    IOrganizationDailyUsage,
    IOrganizationDailyUsageRequest
>({
    url: '/api/v1/orgnaization-daily-usage',
    baseKey: 'orgnaization-daily-usage',
})

export const {
    API,
    route: organizationDailyUsageAPIRoute,

    create: createOrganizationDailyUsage,
    updateById: updateOrganizationDailyUsageById,

    deleteById: deleteOrganizationDailyUsageById,
    deleteMany: deleteManyOrganizationDailyUsage,

    getById: getOrganizationDailyUsageById,
    getAll: getAllOrganizationDailyUsage,
    getPaginated: getPaginatedOrganizationDailyUsage,
} = apiCrudService

export { organizationDailyUsageBaseKey }

export const {
    useCreate: useCreateOrganizationDailyUsage,
    useUpdateById: useUpdateOrganizationDailyUsageById,

    useGetAll: useGetAllOrganizationDailyUsage,
    useGetById: useGetOrganizationDailyUsageById,
    useGetPaginated: useGetPaginatedOrganizationDailyUsage,

    useDeleteById: useDeleteOrganizationDailyUsageById,
    useDeleteMany: useDeleteManyOrganizationDailyUsage,
} = apiCrudHooks

export const logger = Logger.getInstance('orgnaization-daily-usage')
