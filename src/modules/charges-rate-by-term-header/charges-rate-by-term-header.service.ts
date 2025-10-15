import { Logger } from '@/helpers/loggers'
import type {
    IChargesRateByTermHeader,
    IChargesRateByTermHeaderReqest,
} from '@/modules/charges-rate-by-term-header'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: chargesRateByTermHeaderBaseKey,
} = createDataLayerFactory<
    IChargesRateByTermHeader,
    IChargesRateByTermHeaderReqest
>({
    url: '/api/v1/charges-rate-by-term-header',
    baseKey: 'charges-rate-by-term-header',
})

export const {
    API,
    route: chargesRateByTermHeaderAPIRoute,

    create: createChargesRateByTermHeader,
    updateById: updateChargesRateByTermHeaderById,

    deleteById: deleteChargesRateByTermHeaderById,
    deleteMany: deleteManyChargesRateByTermHeader,

    getById: getChargesRateByTermHeaderById,
    getAll: getAllChargesRateByTermHeader,
    getPaginated: getPaginatedChargesRateByTermHeader,
} = apiCrudService

export { chargesRateByTermHeaderBaseKey }

export const {
    useCreate: useCreateChargesRateByTermHeader,
    useUpdateById: useUpdateChargesRateByTermHeaderById,

    useGetAll: useGetAllChargesRateByTermHeader,
    useGetById: useGetChargesRateByTermHeaderById,
    useGetPaginated: useGetPaginatedChargesRateByTermHeader,

    useDeleteById: useDeleteChargesRateByTermHeaderById,
    useDeleteMany: useDeleteManyChargesRateByTermHeader,
} = apiCrudHooks

export const logger = Logger.getInstance('charges-rate-by-term-header')
