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
    IJournalVoucher,
    IJournalVoucherPaginated,
    IJournalVoucherPrintRequest,
    IJournalVoucherRequest,
    TJournalActionMode,
    TPrintMode,
} from '../journal-voucher'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: journalVoucherBaseKey,
} = createDataLayerFactory<IJournalVoucher, IJournalVoucherRequest>({
    url: '/api/v1/journal-voucher',
    baseKey: 'journal-voucher',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: journalVoucherAPIRoute, // matches url above

    create: createJournalVoucher,
    updateById: updateJournalVoucherById,

    deleteById: deleteJournalVoucherById,
    deleteMany: deleteManyJournalVoucher,

    getById: getJournalVoucherById,
    getAll: getAllJournalVoucher,
    getPaginated: getPaginatedJournalVoucher,
} = apiCrudService

// 🪝 HOOK STARTS HERE
export { journalVoucherBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateJournalVoucher,
    useUpdateById: useUpdateJournalVoucherById,

    // useGetAll: useGetAllJournalVoucher,
    useGetById: useGetJournalVoucherById,
    useGetPaginated: useGetPaginatedJournalVoucher,

    useDeleteById: useDeleteJournalVoucherById,
    useDeleteMany: useDeleteManyJournalVoucher,
} = apiCrudHooks

type TloanTransactionMode = 'draft' | 'printed' | 'approved' | 'released'

export const useGetAllJournalVoucher = ({
    mode,

    query,
    options,
}: {
    mode?: TloanTransactionMode

    query?: TAPIQueryOptions
    options?: HookQueryOptions<IJournalVoucher[], Error>
}) => {
    return useQuery<IJournalVoucher[], Error>({
        ...options,
        queryKey: ['get-all-journal-voucher', mode, query].filter(Boolean),
        queryFn: async () => {
            let url = `${journalVoucherAPIRoute}`

            if (mode) {
                url = `${journalVoucherAPIRoute}/${mode}`
            }

            return getAllJournalVoucher({ url, query })
        },
    })
}

export const useFilteredPaginatedJournalVoucher = ({
    mode,
    query,
    options,
}: {
    mode?: 'approved' | 'unreleased'
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IJournalVoucherPaginated, Error>
}) => {
    return useQuery<IJournalVoucherPaginated, Error>({
        ...options,
        queryKey: ['journal-voucher', 'filtered-paginated', mode, query].filter(
            Boolean
        ),
        queryFn: async () => {
            const url: string = `${journalVoucherAPIRoute}/${mode ? mode : ''}/search`
            const finalUrl = qs.stringifyUrl(
                {
                    url,
                    query,
                },
                { skipNull: true }
            )
            return await getPaginatedJournalVoucher<IJournalVoucher>({
                url: finalUrl,
                query,
            })
        },
    })
}

export const useEditPrintJournalVoucher = createMutationFactory<
    IJournalVoucher,
    Error,
    {
        journal_voucher_id: TEntityId
        voucher_number?: number
        mode: TPrintMode
    }
>({
    mutationFn: async ({ journal_voucher_id, voucher_number, mode }) => {
        const response = await API.put<
            { voucher_number?: number },
            IJournalVoucher
        >(
            `${journalVoucherAPIRoute}/${journal_voucher_id}/${mode ? mode : 'print'}`,
            mode ? {} : { voucher_number }
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(journalVoucherBaseKey, args),
})

// For approve, undo-approve, release
export const useJournalVoucherActions = createMutationFactory<
    IJournalVoucher,
    Error,
    {
        journal_voucher_id: TEntityId
        mode: TJournalActionMode
    }
>({
    mutationFn: async ({ journal_voucher_id, mode = 'print-only' }) => {
        const response = await API.post<
            { journal_voucher_id?: TEntityId },
            IJournalVoucher
        >(`${journalVoucherAPIRoute}/${journal_voucher_id}/${mode}`)
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(journalVoucherBaseKey, args),
})

// PRINT JOURNAL VOUCHER
const printJournalVoucher = async (data: {
    journalVoucherId: TEntityId
    payload: IJournalVoucherPrintRequest
}) => {
    const response = await API.put<
        IJournalVoucherPrintRequest,
        IJournalVoucher
    >(`${journalVoucherAPIRoute}/${data.journalVoucherId}/print`, data.payload)
    return response.data
}

export const usePrintJournalVoucherTransaction = createMutationFactory<
    IJournalVoucher,
    Error,
    { journalVoucherId: TEntityId; payload: IJournalVoucherPrintRequest }
>({
    mutationFn: (data) => printJournalVoucher(data),
    invalidationFn: (args) =>
        updateMutationInvalidationFn(journalVoucherBaseKey, args),
})
