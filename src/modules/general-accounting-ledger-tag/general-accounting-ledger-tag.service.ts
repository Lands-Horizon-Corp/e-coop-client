import { Logger } from '@/helpers/loggers'
import type {
    IGeneralLedgerTag,
    IGeneralLedgerTagRequest,
} from '@/modules/general-accounting-ledger-tag'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generalLedgerTagBaseKey,
} = createDataLayerFactory<IGeneralLedgerTag, IGeneralLedgerTagRequest>({
    url: '/api/v1/general-accounting-ledger-tag',
    baseKey: 'general-accounting-ledger-tag',
})

export const {
    API,
    route: generalLedgerTagAPIRoute,

    create: createGeneralLedgerTag,
    updateById: updateGeneralLedgerTagById,

    deleteById: deleteGeneralLedgerTagById,
    deleteMany: deleteManyGeneralLedgerTag,

    getById: getGeneralLedgerTagById,
    getAll: getAllGeneralLedgerTag,
    getPaginated: getPaginatedGeneralLedgerTag,
} = apiCrudService

export { generalLedgerTagBaseKey }

export const {
    useCreate: useCreateGeneralLedgerTag,
    useUpdateById: useUpdateGeneralLedgerTagById,

    useGetAll: useGetAllGeneralLedgerTag,
    useGetById: useGetGeneralLedgerTagById,
    useGetPaginated: useGetPaginatedGeneralLedgerTag,

    useDeleteById: useDeleteGeneralLedgerTagById,
    useDeleteMany: useDeleteManyGeneralLedgerTag,
} = apiCrudHooks

export const logger = Logger.getInstance('general-accounting-ledger-tag')
