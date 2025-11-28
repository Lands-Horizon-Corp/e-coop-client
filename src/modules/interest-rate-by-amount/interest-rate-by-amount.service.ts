import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IInterestRateByAmount,
    IInterestRateByAmountRequest,
} from '../interest-rate-by-amount'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: interestRateByAmountBaseKey,
} = createDataLayerFactory<IInterestRateByAmount, IInterestRateByAmountRequest>(
    {
        url: '/api/v1/interest-rate-by-amount',
        baseKey: 'interest-rate-by-amount',
    }
)

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: interestRateByAmountAPIRoute, // matches url above

    create: createInterestRateByAmount,
    updateById: updateInterestRateByAmountById,

    deleteById: deleteInterestRateByAmountById,
    deleteMany: deleteManyInterestRateByAmount,

    getById: getInterestRateByAmountById,
    getAll: getAllInterestRateByAmount,
    getPaginated: getPaginatedInterestRateByAmount,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { interestRateByAmountBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateInterestRateByAmount,
    useUpdateById: useUpdateInterestRateByAmountById,

    useGetAll: useGetAllInterestRateByAmount,
    useGetById: useGetInterestRateByAmountById,
    useGetPaginated: useGetPaginatedInterestRateByAmount,

    useDeleteById: useDeleteInterestRateByAmountById,
    useDeleteMany: useDeleteManyInterestRateByAmount,
} = apiCrudHooks

export const logger = Logger.getInstance('interest-rate-by-amount')
// custom hooks can go here
