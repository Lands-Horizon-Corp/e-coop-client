import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import BranchService from '@/api-service/branch-service'

import {
    TEntityId,
    IMediaRequest,
    IBranchRequest,
    IBranchResource,
    IBranchPaginatedResource,
} from '@/types/coop-types'
import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IAPIFilteredPaginatedHook,
} from './types'

// for route pathParam loader
export const branchLoader = (
    companyId: TEntityId,
    preloads: string[] = ['Owner', 'Owner.Media', 'Media']
) =>
    queryOptions<IBranchResource>({
        queryKey: ['branch', 'loader', companyId],
        queryFn: async () => {
            const data = await BranchService.getById(companyId, preloads)
            return data
        },
        retry: 0,
    })

// Get branch by ID
export const useBranch = ({
    branchId,
    showMessage = true,
    preloads = ['Company', 'Company.Media'],
    onError,
    onSuccess,
    ...other
}: { branchId: TEntityId } & IAPIHook<IBranchResource, string> &
    IQueryProps<IBranchResource>) => {
    return useQuery<IBranchResource, string>({
        queryKey: ['branch', branchId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                BranchService.getById(branchId, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            if (showMessage) toast.success('Branch Created')
            onSuccess?.(data)

            return data
        },
        ...other,
    })
}

// Create branch
export const useCreateBranch = ({
    showMessage = true,
    preloads = ['Company', 'Company.Media'],
    onError,
    onSuccess,
}: IAPIHook<IBranchResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<IBranchResource, string, IBranchRequest>({
        mutationKey: ['branch', 'create'],
        mutationFn: async (newBranchData) => {
            const [error, data] = await withCatchAsync(
                BranchService.create(newBranchData, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData(['branch', data.id], data)
            queryClient.setQueryData(['branch', 'loader', data.id], data)

            if (showMessage) toast.success('Branch Created')
            onSuccess?.(data)

            return data
        },
    })
}

// Update branch
export const useUpdateBranch = ({
    showMessage = true,
    preloads = ['Media', 'Owner', 'Owner.Media'],
    onError,
    onSuccess,
}: IAPIHook<IBranchResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IBranchResource,
        string,
        {
            id: TEntityId
            data: IBranchRequest
        }
    >({
        mutationKey: ['branch', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, response] = await withCatchAsync(
                BranchService.update(id, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(errorMessage)
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.setQueriesData<IBranchPaginatedResource>(
                { queryKey: ['branch', 'resource-query'], exact: false },
                (oldData) => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        data: oldData.data.map((branch) =>
                            branch.id === id ? response : branch
                        ),
                    }
                }
            )

            queryClient.setQueryData<IBranchResource>(['branch', id], response)
            queryClient.setQueryData<IBranchResource>(
                ['branch', 'loader', id],
                response
            )

            onSuccess?.(response)

            if (showMessage) toast.success('Branch updated.')
            return response
        },
    })
}

// Update branch logo
export const useUpdateBranchProfilePicture = ({
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<IBranchResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { branchId: TEntityId; mediaResource: IMediaRequest }
    >({
        mutationKey: ['branch', 'update', 'logo'],
        mutationFn: async ({ branchId, mediaResource }) => {
            const [error, data] = await withCatchAsync(
                BranchService.ProfilePicture(branchId, mediaResource)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage)
                    toast.error(`Failed to update branch: ${errorMessage}`)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.setQueriesData<IBranchPaginatedResource>(
                { queryKey: ['branch', 'resource-query'], exact: false },
                (oldData) => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        data: oldData.data.map((branch) =>
                            branch.id === branchId ? data : branch
                        ),
                    }
                }
            )

            queryClient.setQueryData<IBranchResource>(
                ['branch', branchId],
                data
            )
            queryClient.setQueryData<IBranchResource>(
                ['branch', 'loader', branchId],
                data
            )

            if (showMessage) toast.success('Branch Logo Updated')
            onSuccess?.(data)
        },
    })
}

// Delete branch
export const useDeleteBranch = ({
    showMessage = true,
    onSuccess,
    onError,
}: undefined | (IAPIHook & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['branch', 'delete'],
        mutationFn: async (branchId) => {
            const [error] = await withCatchAsync(BranchService.delete(branchId))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.invalidateQueries({
                queryKey: ['branch', 'resource-query'],
                exact: false,
            })

            queryClient.invalidateQueries({ queryKey: ['branch', branchId] })
            queryClient.removeQueries({
                queryKey: ['branch', 'loader', branchId],
            })

            if (showMessage) toast.success('Branch deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedBranch = ({
    sort,
    enabled,
    showMessage = true,
    filterPayload,
    preloads = ['Media', 'Company'],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IBranchPaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IBranchPaginatedResource, string>({
        queryKey: ['branch', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                BranchService.getBranches({
                    preloads,
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
