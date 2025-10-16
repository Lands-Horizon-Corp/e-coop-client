import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import {
    IChargesRateByRangeOrMinimumAmount,
    IChargesRateByRangeOrMinimumAmountRequest,
} from './charges-by-range-or-minimum-amount.types'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: chargesRateByRangeOrMinimumAmountBaseKey,
} = createDataLayerFactory<
    IChargesRateByRangeOrMinimumAmount,
    IChargesRateByRangeOrMinimumAmountRequest
>({
    url: '/api/v1/charges-rate-by-range-or-minimum-amount',
    baseKey: 'charges-rate-by-range-or-minimum-amount',
})

export const {
    API,
    route: chargesRateByRangeOrMinimumAmountAPIRoute,

    create: createChargesRateByRangeOrMinimumAmount,
    updateById: updateChargesRateByRangeOrMinimumAmountById,

    deleteById: deleteChargesRateByRangeOrMinimumAmountById,
    deleteMany: deleteManyChargesRateByRangeOrMinimumAmount,

    getById: getChargesRateByRangeOrMinimumAmountById,
    getAll: getAllChargesRateByRangeOrMinimumAmount,
    getPaginated: getPaginatedChargesRateByRangeOrMinimumAmount,
} = apiCrudService

export { chargesRateByRangeOrMinimumAmountBaseKey }

export const {
    useCreate: useCreateChargesRateByRangeOrMinimumAmount,
    useUpdateById: useUpdateChargesRateByRangeOrMinimumAmountById,

    useGetAll: useGetAllChargesRateByRangeOrMinimumAmount,
    useGetById: useGetChargesRateByRangeOrMinimumAmountById,
    useGetPaginated: useGetPaginatedChargesRateByRangeOrMinimumAmount,

    useDeleteById: useDeleteChargesRateByRangeOrMinimumAmountById,
    useDeleteMany: useDeleteManyChargesRateByRangeOrMinimumAmount,
} = apiCrudHooks

export const logger = Logger.getInstance(
    'charges-rate-by-range-or-minimum-amount'
)
