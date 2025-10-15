import { Logger } from '@/helpers/loggers'
import type {
    IChargesRateSchemeAccount,
    IChargesRateSchemeAccountRequest,
} from '@/modules/charges-rate-scheme-account'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: chargesRateSchemeAccountBaseKey,
} = createDataLayerFactory<
    IChargesRateSchemeAccount,
    IChargesRateSchemeAccountRequest
>({
    url: '/api/v1/charges-rate-scheme-account',
    baseKey: 'charges-rate-scheme-account',
})

export const {
    API,
    route: chargesRateSchemeAccountAPIRoute,

    create: createChargesRateSchemeAccount,
    updateById: updateChargesRateSchemeAccountById,

    deleteById: deleteChargesRateSchemeAccountById,
    deleteMany: deleteManyChargesRateSchemeAccount,

    getById: getChargesRateSchemeAccountById,
    getAll: getAllChargesRateSchemeAccount,
    getPaginated: getPaginatedChargesRateSchemeAccount,
} = apiCrudService

export { chargesRateSchemeAccountBaseKey }

export const {
    useCreate: useCreateChargesRateSchemeAccount,
    useUpdateById: useUpdateChargesRateSchemeAccountById,

    useGetAll: useGetAllChargesRateSchemeAccount,
    useGetById: useGetChargesRateSchemeAccountById,
    useGetPaginated: useGetPaginatedChargesRateSchemeAccount,

    useDeleteById: useDeleteChargesRateSchemeAccountById,
    useDeleteMany: useDeleteManyChargesRateSchemeAccount,
} = apiCrudHooks

export const logger = Logger.getInstance('charges-rate-scheme-account')
