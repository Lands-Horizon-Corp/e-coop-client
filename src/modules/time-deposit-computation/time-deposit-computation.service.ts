import { Logger } from '@/helpers/loggers'
import type {
    ITimeDepositComputation,
    ITimeDepositComputationRequest,
} from '@/modules/time-deposit-computation'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: timeDepositComputationBaseKey,
} = createDataLayerFactory<
    ITimeDepositComputation,
    ITimeDepositComputationRequest
>({
    url: '/api/v1/time-deposit-computation',
    baseKey: 'time-deposit-computation',
})

export const {
    API,
    route: timeDepositComputationAPIRoute,

    create: createTimeDepositComputation,
    updateById: updateTimeDepositComputationById,

    deleteById: deleteTimeDepositComputationById,
    deleteMany: deleteManyTimeDepositComputation,

    getById: getTimeDepositComputationById,
    getAll: getAllTimeDepositComputation,
    getPaginated: getPaginatedTimeDepositComputation,
} = apiCrudService

export { timeDepositComputationBaseKey }

export const {
    useCreate: useCreateTimeDepositComputation,
    useUpdateById: useUpdateTimeDepositComputationById,

    useGetAll: useGetAllTimeDepositComputation,
    useGetById: useGetTimeDepositComputationById,
    useGetPaginated: useGetPaginatedTimeDepositComputation,

    useDeleteById: useDeleteTimeDepositComputationById,
    useDeleteMany: useDeleteManyTimeDepositComputation,
} = apiCrudHooks

export const logger = Logger.getInstance('time-deposit-computation')
