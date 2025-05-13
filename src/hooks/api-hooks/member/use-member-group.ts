import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as GroupService from '@/api-service/member-services/member-group-service'

import {
    TEntityId,
    IMemberGroup,
    IMemberGroupRequest,
    IMemberGroupPaginated,
} from '@/types'
import {
    IAPIHook,
    IQueryProps,
    IOperationCallbacks,
    IAPIFilteredPaginatedHook,
} from '@/types/api-hooks-types'

export const useCreateMemberGroup = ({
    showMessage = true,
    onError,
    onSuccess,
}: IAPIHook<IMemberGroup, string> & IQueryProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberGroup, string, IMemberGroupRequest>({
        mutationKey: ['group', 'create'],
        mutationFn: async (data) => {
            const [error, newGroup] = await withCatchAsync(
                GroupService.createMemberGroup(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['group', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['group', newGroup.id],
            })
            queryClient.removeQueries({
                queryKey: ['group', 'loader', newGroup.id],
            })

            if (showMessage) toast.success('New Group Created')
            onSuccess?.(newGroup)

            return newGroup
        },
    })
}

export const useUpdateMemberGroup = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IMemberGroup, string> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberGroup,
        string,
        { groupId: TEntityId; data: IMemberGroupRequest }
    >({
        mutationKey: ['group', 'update'],
        mutationFn: async ({ groupId, data }) => {
            const [error, result] = await withCatchAsync(
                GroupService.updateMemberGroup(groupId, data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['group', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['group', groupId],
            })
            queryClient.removeQueries({
                queryKey: ['group', 'loader', groupId],
            })

            toast.success('Group updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteMemberGroup = ({
    onError,
    onSuccess,
}: IOperationCallbacks = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['group', 'delete'],
        mutationFn: async (groupId) => {
            const [error] = await withCatchAsync(
                GroupService.deleteMemberGroup(groupId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['group', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['group', groupId],
            })
            queryClient.removeQueries({
                queryKey: ['group', 'loader', groupId],
            })

            toast.success('Group deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useMemberGroups = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberGroupPaginated, string> & IQueryProps = {}) => {
    return useQuery<IMemberGroup[], string>({
        queryKey: ['group', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GroupService.getAllMemberGroups()
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

export const useFilteredPaginatedMemberGroups = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGroupPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberGroupPaginated, string>({
        queryKey: ['group', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GroupService.getPaginatedMemberGroups({
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
