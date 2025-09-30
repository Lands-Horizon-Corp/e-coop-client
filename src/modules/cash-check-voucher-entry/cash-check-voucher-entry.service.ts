import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    ICashCheckVoucherEntry,
    ICashCheckVoucherEntryRequest,
} from '../cash-check-voucher-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: cashCheckVoucherEntryBaseKey,
} = createDataLayerFactory<
    ICashCheckVoucherEntry,
    ICashCheckVoucherEntryRequest
>({
    url: '/api/v1/cash-check-voucher-entry',
    baseKey: 'cash-check-voucher-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: cashCheckVoucherEntryAPIRoute, // matches url above

    create: createCashCheckVoucherEntry,
    updateById: updateCashCheckVoucherEntryById,

    deleteById: deleteCashCheckVoucherEntryById,
    deleteMany: deleteManyCashCheckVoucherEntry,

    getById: getCashCheckVoucherEntryById,
    getAll: getAllCashCheckVoucherEntry,
    getPaginated: getPaginatedCashCheckVoucherEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { cashCheckVoucherEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateCashCheckVoucherEntry,
    useUpdateById: useUpdateCashCheckVoucherEntryById,

    useGetAll: useGetAllCashCheckVoucherEntry,
    useGetById: useGetCashCheckVoucherEntryById,
    useGetPaginated: useGetPaginatedCashCheckVoucherEntry,

    useDeleteById: useDeleteCashCheckVoucherEntryById,
    useDeleteMany: useDeleteManyCashCheckVoucherEntry,
} = apiCrudHooks

// custom hooks can go here
