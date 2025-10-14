import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IJournalVoucherTag,
    IJournalVoucherTagRequest,
} from '../journal-voucher-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: journalVoucherTagBaseKey,
} = createDataLayerFactory<IJournalVoucherTag, IJournalVoucherTagRequest>({
    url: '/api/v1/journal-voucher-tag',
    baseKey: 'journal-voucher-tag',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: journalVoucherTagAPIRoute, // matches url above

    create: createJournalVoucherTag,
    updateById: updateJournalVoucherTagById,

    deleteById: deleteJournalVoucherTagById,
    deleteMany: deleteManyJournalVoucherTag,

    getById: getJournalVoucherTagById,
    getAll: getAllJournalVoucherTag,
    getPaginated: getPaginatedJournalVoucherTag,
} = apiCrudService

export { journalVoucherTagBaseKey }

export const {
    useCreate: useCreateJournalVoucherTag,
    useUpdateById: useUpdateJournalVoucherTagById,

    // useGetAll: useGetAllJournalVoucherTag,
    useGetById: useGetJournalVoucherTagById,
    useGetPaginated: useGetPaginatedJournalVoucherTag,

    useDeleteById: useDeleteJournalVoucherTagById,
    useDeleteMany: useDeleteManyJournalVoucherTag,
} = apiCrudHooks

export type TGellAllCashCheckVoucherTagHookMode = 'all' | 'journal-voucher'

export const useGetAllJournalVoucherTag = ({
    mode = 'all',
    journalVoucherId,
    query,
    options,
}: {
    mode: TGellAllCashCheckVoucherTagHookMode
    journalVoucherId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IJournalVoucherTag[], Error>
}) => {
    return useQuery<IJournalVoucherTag[], Error>({
        ...options,
        queryKey: [
            journalVoucherTagBaseKey,
            'all',
            query,
            mode,
            journalVoucherId,
        ].filter(Boolean),
        queryFn: async () => {
            let url = journalVoucherTagAPIRoute

            if (mode === 'journal-voucher' && journalVoucherId)
                url = `${journalVoucherTagAPIRoute}/journal-voucher/${journalVoucherId}`

            return await getAllJournalVoucherTag({
                query,
                url,
            })
        },
    })
}

export const logger = Logger.getInstance('journal-voucher-tag')
