import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    ICashCheckVoucherTag,
    ICashCheckVoucherTagRequest,
} from '../cash-check-voucher-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: cashCheckVoucherTagBaseKey,
} = createDataLayerFactory<ICashCheckVoucherTag, ICashCheckVoucherTagRequest>({
    url: '/api/v1/cash-check-voucher-tag',
    baseKey: 'cash-check-voucher-tag',
})

export const {
    API,
    route: cashCheckVoucherTagAPIRoute,

    create: createCashCheckVoucherTag,
    updateById: updateCashCheckVoucherTagById,

    deleteById: deleteCashCheckVoucherTagById,
    deleteMany: deleteManyCashCheckVoucherTag,

    getById: getCashCheckVoucherTagById,
    getAll: getAllCashCheckVoucherTag,
    getPaginated: getPaginatedCashCheckVoucherTag,
} = apiCrudService

export { cashCheckVoucherTagBaseKey }

export const {
    useCreate: useCreateCashCheckVoucherTag,
    useUpdateById: useUpdateCashCheckVoucherTagById,

    // useGetAll: useGetAllCashCheckVoucherTag,
    useGetById: useGetCashCheckVoucherTagById,
    useGetPaginated: useGetPaginatedCashCheckVoucherTag,

    useDeleteById: useDeleteCashCheckVoucherTagById,
    useDeleteMany: useDeleteManyCashCheckVoucherTag,
} = apiCrudHooks

export type TGellAllCashCheckVoucherTagHookMode = 'all' | 'cash-check-voucher'

export const useGetAllCashCheckVoucherTag = ({
    mode = 'all',
    cashCheckVoucherId,
    query,
    options,
}: {
    mode: TGellAllCashCheckVoucherTagHookMode
    cashCheckVoucherId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ICashCheckVoucherTag[], Error>
}) => {
    return useQuery<ICashCheckVoucherTag[], Error>({
        ...options,
        queryKey: [
            cashCheckVoucherTagBaseKey,
            'all',
            query,
            mode,
            cashCheckVoucherId,
        ].filter(Boolean),
        queryFn: async () => {
            let url = cashCheckVoucherTagAPIRoute

            if (mode === 'cash-check-voucher')
                url = `${cashCheckVoucherTagAPIRoute}/cash-check-voucher/${cashCheckVoucherId}`

            return await getAllCashCheckVoucherTag({
                query,
                url,
            })
        },
    })
}
export const logger = Logger.getInstance('cash-check-voucher-tag')
