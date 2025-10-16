import { Logger } from '@/helpers/loggers'
import type {
    IGeneratedReport,
    IGeneratedReportsRequest,
} from '@/modules/generated-reports'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generatedReportsBaseKey,
} = createDataLayerFactory<IGeneratedReport, IGeneratedReportsRequest>({
    url: '/api/v1/generated-reports',
    baseKey: 'generated-reports',
})

export const {
    API,
    route: generatedReportsAPIRoute,

    create: createGeneratedReports,
    updateById: updateGeneratedReportsById,

    deleteById: deleteGeneratedReportsById,
    deleteMany: deleteManyGeneratedReports,

    getById: getGeneratedReportsById,
    getAll: getAllGeneratedReports,
    getPaginated: getPaginatedGeneratedReports,
} = apiCrudService

export { generatedReportsBaseKey }

export const {
    useCreate: useCreateGeneratedReports,
    useUpdateById: useUpdateGeneratedReportsById,

    useGetAll: useGetAllGeneratedReports,
    useGetById: useGetGeneratedReportsById,
    useGetPaginated: useGetPaginatedGeneratedReports,

    useDeleteById: useDeleteGeneratedReportsById,
    useDeleteMany: useDeleteManyGeneratedReports,
} = apiCrudHooks

export const logger = Logger.getInstance('generated-reports')
