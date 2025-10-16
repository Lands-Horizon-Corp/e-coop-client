import { Logger } from '@/helpers/loggers'
import type { IFunds, IFundsRequest } from '@/modules/funds'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: fundsBaseKey,
} = createDataLayerFactory<IFunds, IFundsRequest>({
    url: '/api/v1/funds',
    baseKey: 'funds',
})

export const {
    API,
    route: fundsAPIRoute,

    create: createFunds,
    updateById: updateFundsById,

    deleteById: deleteFundsById,
    deleteMany: deleteManyFunds,

    getById: getFundsById,
    getAll: getAllFunds,
    getPaginated: getPaginatedFunds,
} = apiCrudService

export { fundsBaseKey }

export const {
    useCreate: useCreateFunds,
    useUpdateById: useUpdateFundsById,

    useGetAll: useGetAllFunds,
    useGetById: useGetFundsById,
    useGetPaginated: useGetPaginatedFunds,

    useDeleteById: useDeleteFundsById,
    useDeleteMany: useDeleteManyFunds,
} = apiCrudHooks

export const logger = Logger.getInstance('funds')
