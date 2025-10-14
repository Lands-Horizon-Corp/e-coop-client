import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ICancelledCashCheckVoucher,
    ICancelledCashCheckVoucherRequest,
} from '../cancelled-cash-check-voucher'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: cancelledCashCheckVoucherBaseKey,
} = createDataLayerFactory<
    ICancelledCashCheckVoucher,
    ICancelledCashCheckVoucherRequest
>({
    url: '/api/v1/cancelled-cash-check-voucher',
    baseKey: 'cancelled-cash-check-voucher',
})

export const {
    API,
    route: cancelledCashCheckVoucherAPIRoute,

    create: createCancelledCashCheckVoucher,
    updateById: updateCancelledCashCheckVoucherById,

    deleteById: deleteCancelledCashCheckVoucherById,
    deleteMany: deleteManyCancelledCashCheckVoucher,

    getById: getCancelledCashCheckVoucherById,
    getAll: getAllCancelledCashCheckVoucher,
    getPaginated: getPaginatedCancelledCashCheckVoucher,
} = apiCrudService

export { cancelledCashCheckVoucherBaseKey }

export const {
    useCreate: useCreateCancelledCashCheckVoucher,
    useUpdateById: useUpdateCancelledCashCheckVoucherById,

    useGetAll: useGetAllCancelledCashCheckVoucher,
    useGetById: useGetCancelledCashCheckVoucherById,
    useGetPaginated: useGetPaginatedCancelledCashCheckVoucher,

    useDeleteById: useDeleteCancelledCashCheckVoucherById,
    useDeleteMany: useDeleteManyCancelledCashCheckVoucher,
} = apiCrudHooks

export const logger = Logger.getInstance('cancelled-cash-check-voucher')
