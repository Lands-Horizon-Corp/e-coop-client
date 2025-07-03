import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import OnlineEntryService from '@/api-service/online-entry-service'
import {
    createMutationHook,
    deleteMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IOnlineEntry,
    IOnlineEntryPaginated,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useOnlineAllEntry = ({
    enabled,
    showMessage = true,
}: IAPIHook<IOnlineEntry[], string> & IQueryProps = {}) => {
    return useQuery<IOnlineEntry[], string>({
        queryKey: ['online-entry', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OnlineEntryService.allList()
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

export const useFilteredPaginatedOnlineEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IOnlineEntry, string> & IQueryProps = {}) => {
    return useQuery<IOnlineEntryPaginated, string>({
        queryKey: [
            'online-entry',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OnlineEntryService.search({
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

export const useOnlineEntry = ({
    profileId,
    onError,
    onSuccess,
    ...opts
}: { profileId: TEntityId } & IAPIHook<IOnlineEntry, string> &
    IQueryProps<IOnlineEntry>) => {
    return useQuery<IOnlineEntry, string>({
        queryKey: ['online-entry', profileId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                OnlineEntryService.getById(profileId)
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

export const useDeleteOnlineEntry = createMutationHook<void, string, TEntityId>(
    (id) => OnlineEntryService.deleteById(id),
    'Online entry deleted',
    (args) => deleteMutationInvalidationFn('online-entry', args)
)

export const useFilteredBatchOnlineEntry = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    transactionBatchId,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IOnlineEntryPaginated, string> &
    IQueryProps & {
        transactionBatchId: TEntityId
    }) => {
    return useQuery<IOnlineEntryPaginated, string>({
        queryKey: [
            'online-entry',
            'transaction-batch',
            transactionBatchId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OnlineEntryService.getPaginatedBatchOnlineEntry({
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
