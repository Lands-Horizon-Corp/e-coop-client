import { Logger } from '@/helpers/loggers'
import type {
    ITimeDepositType,
    ITimeDepositTypeRequest,
} from '@/modules/time-deposit-type'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: timeDepositTypeBaseKey,
} = createDataLayerFactory<ITimeDepositType, ITimeDepositTypeRequest>({
    url: '/api/v1/time-deposit-type',
    baseKey: 'time-deposit-type',
})

export const {
    API,
    route: timeDepositTypeAPIRoute,

    create: createTimeDepositType,
    updateById: updateTimeDepositTypeById,

    deleteById: deleteTimeDepositTypeById,
    deleteMany: deleteManyTimeDepositType,

    getById: getTimeDepositTypeById,
    getAll: getAllTimeDepositType,
    getPaginated: getPaginatedTimeDepositType,
} = apiCrudService

export { timeDepositTypeBaseKey }

export const {
    useCreate: useCreateTimeDepositType,
    useUpdateById: useUpdateTimeDepositTypeById,

    useGetAll: useGetAllTimeDepositType,
    useGetById: useGetTimeDepositTypeById,
    useGetPaginated: useGetPaginatedTimeDepositType,

    useDeleteById: useDeleteTimeDepositTypeById,
    useDeleteMany: useDeleteManyTimeDepositType,
} = apiCrudHooks

export const logger = Logger.getInstance('time-deposit-type')
