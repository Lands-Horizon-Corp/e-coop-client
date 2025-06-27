import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createMutationHook,
    deleteMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as CheckEntryService from '@/api-service/check-entry-service'

import {
    IAPIHook,
    TEntityId,
    ICheckEntry,
    IQueryProps,
    ICheckEntryPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useCheckAllEntry = ({
    enabled,
    showMessage = true,
}: IAPIHook<ICheckEntry[], string> & IQueryProps = {}) => {
    return useQuery<ICheckEntry[], string>({
        queryKey: ['check-entry', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CheckEntryService.allList()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useFilteredPaginatedCheckEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ICheckEntry, string> & IQueryProps = {}) => {
    return useQuery<ICheckEntryPaginated, string>({
        queryKey: [
            'check-entry',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CheckEntryService.search({
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useChckEntry = ({
    profileId,
    onError,
    onSuccess,
    ...opts
}: { profileId: TEntityId } & IAPIHook<ICheckEntry, string> &
    IQueryProps<ICheckEntry>) => {
    return useQuery<ICheckEntry, string>({
        queryKey: ['check-entry', profileId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                CheckEntryService.getById(profileId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
        ...opts,
    })
}

export const useDeleteCheckEntry = createMutationHook<void, string, TEntityId>(
    (id) => CheckEntryService.deleteById(id),
    'Online entry deleted',
    (args) => deleteMutationInvalidationFn('check-entry', args)
)

export const useFilteredBatchCheckEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<ICheckEntryPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<ICheckEntryPaginated, string>({
        queryKey: [
            'check-entry',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CheckEntryService.getPaginatedBatchCheckEntry({
                    pagination,
                    transactionBatchId,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 5,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
