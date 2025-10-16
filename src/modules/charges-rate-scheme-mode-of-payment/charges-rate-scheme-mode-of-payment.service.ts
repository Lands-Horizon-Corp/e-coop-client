import { Logger } from '@/helpers/loggers'
import type {
    IChargesRateSchemeModeOfPayment,
    IChargesRateSchemeModeOfPaymentRequest,
} from '@/modules/charges-rate-scheme-mode-of-payment'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: chargesRateMemberTypeModeOfPaymentBaseKey,
} = createDataLayerFactory<
    IChargesRateSchemeModeOfPayment,
    IChargesRateSchemeModeOfPaymentRequest
>({
    url: '/api/v1/charges-rate-scheme-mode-of-payment',
    baseKey: 'charges-rate-scheme-mode-of-payment',
})

export const {
    API,
    route: chargesRateMemberTypeModeOfPaymentAPIRoute,

    create: createChargesRateMemberTypeModeOfPayment,
    updateById: updateChargesRateMemberTypeModeOfPaymentById,

    deleteById: deleteChargesRateMemberTypeModeOfPaymentById,
    deleteMany: deleteManyChargesRateMemberTypeModeOfPayment,

    getById: getChargesRateMemberTypeModeOfPaymentById,
    getAll: getAllChargesRateMemberTypeModeOfPayment,
    getPaginated: getPaginatedChargesRateMemberTypeModeOfPayment,
} = apiCrudService

export { chargesRateMemberTypeModeOfPaymentBaseKey }

export const {
    useCreate: useCreateChargesRateMemberTypeModeOfPayment,
    useUpdateById: useUpdateChargesRateMemberTypeModeOfPaymentById,

    useGetAll: useGetAllChargesRateMemberTypeModeOfPayment,
    useGetById: useGetChargesRateMemberTypeModeOfPaymentById,
    useGetPaginated: useGetPaginatedChargesRateMemberTypeModeOfPayment,

    useDeleteById: useDeleteChargesRateMemberTypeModeOfPaymentById,
    useDeleteMany: useDeleteManyChargesRateMemberTypeModeOfPayment,
} = apiCrudHooks

export const logger = Logger.getInstance('charges-rate-scheme-mode-of-payment')
