import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    ICashCheckVoucher,
    ICashCheckVoucherPaginated,
    ICashCheckVoucherRequest,
    TCashCheckVoucherActionMode,
    TCashCheckVoucherPrintMode,
} from '../cash-check-voucher'
import { getPaginatedJournalVoucher } from '../journal-voucher'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: cashCheckVoucherBaseKey,
} = createDataLayerFactory<ICashCheckVoucher, ICashCheckVoucherRequest>({
    url: '/api/v1/cash-check-voucher',
    baseKey: 'cash-check-voucher',
})

export const {
    API,
    route: cashCheckVoucherAPIRoute,

    create: createCashCheckVoucher,
    updateById: updateCashCheckVoucherById,

    deleteById: deleteCashCheckVoucherById,
    deleteMany: deleteManyCashCheckVoucher,

    getById: getCashCheckVoucherById,
    getAll: getAllCashCheckVoucher,
    getPaginated: getPaginatedCashCheckVoucher,
} = apiCrudService

export { cashCheckVoucherBaseKey }

export const {
    useCreate: useCreateCashCheckVoucher,
    useUpdateById: useUpdateCashCheckVoucherById,

    useGetAll: useGetAllCashCheckVoucher,
    useGetById: useGetCashCheckVoucherById,
    useGetPaginated: useGetPaginatedCashCheckVoucher,

    useDeleteById: useDeleteCashCheckVoucherById,
    useDeleteMany: useDeleteManyCashCheckVoucher,
} = apiCrudHooks

export const useFilteredPaginatedCashCheckVoucher = ({
    mode,
    query,
    options,
}: {
    mode?: 'approved' | 'unreleased'
    query?: TAPIQueryOptions
    options?: HookQueryOptions<ICashCheckVoucherPaginated, Error>
}) => {
    return useQuery<ICashCheckVoucherPaginated, Error>({
        ...options,
        queryKey: ['general-ledger', 'filtered-paginated', mode, query].filter(
            Boolean
        ),
        queryFn: async () => {
            const url: string = `${cashCheckVoucherAPIRoute}/${mode ? mode : ''}/search`
            const finalUrl = qs.stringifyUrl(
                {
                    url,
                    query,
                },
                { skipNull: true }
            )
            return await getPaginatedJournalVoucher<ICashCheckVoucher>({
                url: finalUrl,
                query,
            })
        },
    })
}

export const useEditPrintCashCheckVoucher = createMutationFactory<
    ICashCheckVoucher,
    Error,
    {
        cash_check_voucher_id: TEntityId
        voucher_number?: number
        mode: TCashCheckVoucherPrintMode
    }
>({
    mutationFn: async ({ cash_check_voucher_id, voucher_number, mode }) => {
        const response = await API.put<
            { voucher_number?: number },
            ICashCheckVoucher
        >(
            `${cashCheckVoucherAPIRoute}/${cash_check_voucher_id}/${mode ? mode : 'print'}`,
            mode ? {} : { voucher_number }
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(cashCheckVoucherBaseKey, args),
})

// For approve, undo-approve, release
export const useCashCheckVoucherActions = createMutationFactory<
    ICashCheckVoucher,
    Error,
    {
        cash_check_voucher_id: TEntityId
        mode: TCashCheckVoucherActionMode
    }
>({
    mutationFn: async ({ cash_check_voucher_id, mode = 'print-only' }) => {
        const response = await API.post<
            { cash_check_voucher_id?: TEntityId },
            ICashCheckVoucher
        >(`${cashCheckVoucherAPIRoute}/${cash_check_voucher_id}/${mode}`)
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(cashCheckVoucherBaseKey, args),
})
