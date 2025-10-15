import { Logger } from '@/helpers/loggers'
import type {
    ITransactionTag,
    ITransactionTagRequest,
} from '@/modules/transaction-tag'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: transactionTagBaseKey,
} = createDataLayerFactory<ITransactionTag, ITransactionTagRequest>({
    url: '/api/v1/transaction-tag',
    baseKey: 'transaction-tag',
})

export const {
    API,
    route: transactionTagAPIRoute,

    create: createTransactionTag,
    updateById: updateTransactionTagById,

    deleteById: deleteTransactionTagById,
    deleteMany: deleteManyTransactionTag,

    getById: getTransactionTagById,
    getAll: getAllTransactionTag,
    getPaginated: getPaginatedTransactionTag,
} = apiCrudService

export { transactionTagBaseKey }

export const {
    useCreate: useCreateTransactionTag,
    useUpdateById: useUpdateTransactionTagById,

    useGetAll: useGetAllTransactionTag,
    useGetById: useGetTransactionTagById,
    useGetPaginated: useGetPaginatedTransactionTag,

    useDeleteById: useDeleteTransactionTagById,
    useDeleteMany: useDeleteManyTransactionTag,
} = apiCrudHooks

export const logger = Logger.getInstance('transaction-tag')
