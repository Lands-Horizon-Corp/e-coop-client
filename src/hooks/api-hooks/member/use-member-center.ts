import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberCenterService from '@/api-service/member-services/member-center-service'

import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IAPIFilteredPaginatedHook,
    TEntityId,
    IMemberCenterRequest,
    IMemberCenter,
    IMemberCenterPaginated,
} from '@/types'

export const memberCenterLoader = (
    memberCenterId: TEntityId,
    preloads: string[] = []
) =>
    queryOptions<IMemberCenter>({
        queryKey: ['member-center', 'loader', memberCenterId],
        queryFn: async () => {
            const data = await MemberCenterService.getMemberCenterById(
                memberCenterId,
                preloads
            )
            return data
        },
        retry: 0,
    })

export const useCreateMemberCenter = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMemberCenter, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberCenter, string, IMemberCenterRequest>({
        mutationKey: ['member-center', 'create'],
        mutationFn: async (data) => {
            const [error, newMemberCenter] = await withCatchAsync(
                MemberCenterService.createMemberCenter(data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-center', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-center', newMemberCenter.id],
            })
            queryClient.removeQueries({
                queryKey: ['member-center', 'loader', newMemberCenter.id],
            })

            if (showMessage) toast.success('New Member Center Created')
            onSuccess?.(newMemberCenter)

            return newMemberCenter
        },
    })
}

export const useUpdateMemberCenter = ({
    showMessage = true,
    preloads = [],
    onSuccess,
    onError,
}: IAPIHook<IMemberCenter, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { memberCenterId: TEntityId; data: IMemberCenterRequest }
    >({
        mutationKey: ['member-center', 'update'],
        mutationFn: async ({ memberCenterId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.updateMemberCenter(
                    memberCenterId,
                    data,
                    preloads
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-center', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-center', memberCenterId],
            })
            queryClient.removeQueries({
                queryKey: ['member-center', 'loader', memberCenterId],
            })

            if (showMessage) toast.success('Member Center updated')
            onSuccess?.(result)
        },
    })
}

export const useDeleteMemberCenter = ({
    showMessage = false,
    onSuccess,
    onError,
}: IAPIHook & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['member-center', 'delete'],
        mutationFn: async (memberCenterId) => {
            const [error] = await withCatchAsync(
                MemberCenterService.deleteMemberCenter(memberCenterId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-center', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-center', memberCenterId],
            })
            queryClient.removeQueries({
                queryKey: ['member-center', 'loader', memberCenterId],
            })

            if (showMessage) toast.success('Member Center deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedMemberCenters = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberCenterPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberCenterPaginated, string>({
        queryKey: [
            'member-center',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.getPaginatedMemberCenters({
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

export const useMemberCenter = ({
    enabled,
    preloads = [],
    showMessage = true,
}: IAPIHook<IMemberCenter[], string> & IQueryProps = {}) => {
    return useQuery<IMemberCenter[], string>({
        queryKey: ['member-center', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.getAllMemberCenters(preloads)
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

export const useFilteredPaginatedMemberCenter = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberCenterPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberCenterPaginated, string>({
        queryKey: [
            'member-center',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberCenterService.getPaginatedMemberCenters({
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
