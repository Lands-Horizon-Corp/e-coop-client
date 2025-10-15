import { Logger } from '@/helpers/loggers'
import type {
    ICollectorsMemberAccountEntry,
    ICollectorsMemberAccountEntryRequest,
} from '@/modules/collectors-member-account-entry'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: collectorsMemberAccountEntryBaseKey,
} = createDataLayerFactory<
    ICollectorsMemberAccountEntry,
    ICollectorsMemberAccountEntryRequest
>({
    url: '/api/v1/collectors-member-account-entry',
    baseKey: 'collectors-member-account-entry',
})

export const {
    API,
    route: collectorsMemberAccountEntryAPIRoute,

    create: createCollectorsMemberAccountEntry,
    updateById: updateCollectorsMemberAccountEntryById,

    deleteById: deleteCollectorsMemberAccountEntryById,
    deleteMany: deleteManyCollectorsMemberAccountEntry,

    getById: getCollectorsMemberAccountEntryById,
    getAll: getAllCollectorsMemberAccountEntry,
    getPaginated: getPaginatedCollectorsMemberAccountEntry,
} = apiCrudService

export { collectorsMemberAccountEntryBaseKey }

export const {
    useCreate: useCreateCollectorsMemberAccountEntry,
    useUpdateById: useUpdateCollectorsMemberAccountEntryById,

    useGetAll: useGetAllCollectorsMemberAccountEntry,
    useGetById: useGetCollectorsMemberAccountEntryById,
    useGetPaginated: useGetPaginatedCollectorsMemberAccountEntry,

    useDeleteById: useDeleteCollectorsMemberAccountEntryById,
    useDeleteMany: useDeleteManyCollectorsMemberAccountEntry,
} = apiCrudHooks

export const logger = Logger.getInstance('collectors-member-account-entry')
