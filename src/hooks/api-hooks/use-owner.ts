import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import OwnerService from '@/api-service/owner-service'

import {
    IAPIPreloads,
    IOperationCallbacks,
    IFilterPaginatedHookProps,
    IQueryProps,
} from './types'
import {
    IOwner,
    ICompanyResource,
    IOwnerPaginatedResource,
    IBranchPaginated,
    TEntityId,
} from '@/types'

// Load Specific owner by ID
export const useOwner = ({
    ownerId,
    onError,
    preloads = ['Media'],
}: Omit<IOperationCallbacks<IOwner, string> & IAPIPreloads, 'onSuccess'> & {
    ownerId: TEntityId
}) => {
    const queryClient = useQueryClient()

    return useQuery<IOwner>({
        queryKey: ['owner', ownerId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                OwnerService.getById(ownerId, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (onError) onError(errorMessage)
                else toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData(['owner', ownerId], data)
            queryClient.setQueryData(['owner', 'loader', ownerId], data)

            return data
        },
        enabled: ownerId !== undefined && ownerId !== null,
    })
}

export const useOwnerCompany = ({
    ownerId,
    preloads = ['Owner', 'Owner.Media'],
    onError,
    onSuccess,
}: { ownerId: TEntityId } & IOperationCallbacks<ICompanyResource> &
    IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useQuery<ICompanyResource>({
        queryKey: ['owner', 'company', ownerId],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                OwnerService.getOwnCompany(ownerId, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (onError) onError(errorMessage)
                else toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData<ICompanyResource>(
                ['company', response.id],
                response
            )
            queryClient.setQueryData<ICompanyResource>(
                ['company', 'loader', response.id],
                response
            )

            onSuccess?.(response)
            return response
        },
        retry: 0,
        enabled: ownerId !== null || ownerId !== undefined,
    })
}

export const useOwnerPaginatedBranch = ({
    sort,
    enabled,
    ownerId,
    filterPayload,
    preloads = ['Media'],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IFilterPaginatedHookProps & IQueryProps & { ownerId: TEntityId }) => {
    return useQuery<IBranchPaginated, string>({
        queryKey: ['branch', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OwnerService.getBranches({
                    ownerId,
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
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

// paginated/ filtered and sorted
export const useFilteredPaginatedOwners = ({
    sort,
    enabled,
    filterPayload,
    preloads = ['Media', 'Company'],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IFilterPaginatedHookProps & IQueryProps = {}) => {
    return useQuery<IOwnerPaginatedResource, string>({
        queryKey: ['owner', 'resource-query', filterPayload, pagination],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OwnerService.getOwners({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
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
        retry: 1,
        enabled: enabled,
    })
}
