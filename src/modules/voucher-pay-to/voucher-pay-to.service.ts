import { Logger } from '@/helpers/loggers'
import type {
    IVoucherPayTo,
    IVoucherPayToRequest,
} from '@/modules/voucher-pay-to'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: voucherPayToBaseKey,
} = createDataLayerFactory<IVoucherPayTo, IVoucherPayToRequest>({
    url: '/api/v1/voucher-pay-to',
    baseKey: 'voucher-pay-to',
})

export const {
    API,
    route: voucherPayToAPIRoute,

    create: createVoucherPayTo,
    updateById: updateVoucherPayToById,

    deleteById: deleteVoucherPayToById,
    deleteMany: deleteManyVoucherPayTo,

    getById: getVoucherPayToById,
    getAll: getAllVoucherPayTo,
    getPaginated: getPaginatedVoucherPayTo,
} = apiCrudService

export { voucherPayToBaseKey }

export const {
    useCreate: useCreateVoucherPayTo,
    useUpdateById: useUpdateVoucherPayToById,

    useGetAll: useGetAllVoucherPayTo,
    useGetById: useGetVoucherPayToById,
    useGetPaginated: useGetPaginatedVoucherPayTo,

    useDeleteById: useDeleteVoucherPayToById,
    useDeleteMany: useDeleteManyVoucherPayTo,
} = apiCrudHooks

export const logger = Logger.getInstance('voucher-pay-to')
