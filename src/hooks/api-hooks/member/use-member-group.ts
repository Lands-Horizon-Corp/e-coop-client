import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import GroupService from '@/api-service/member-services/member-group-service'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IMemberGroup,
    IMemberGroupPaginated,
    IMemberGroupRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useCreateMemberGroup = createMutationHook<
    IMemberGroup,
    string,
    IMemberGroupRequest
>(
    (data) => GroupService.create(data),
    'New member group created',
    (args) => createMutationInvalidateFn('member-group', args)
)

export const useUpdateMemberGroup = createMutationHook<
    IMemberGroup,
    string,
    { groupId: TEntityId; data: IMemberGroupRequest }
>(
    ({ groupId, data }) => GroupService.updateById(groupId, data),
    'Updated member group',
    (args) => updateMutationInvalidationFn('member-group', args)
)

export const useDeleteMemberGroup = createMutationHook<void, string, TEntityId>(
    (groupId) => GroupService.deleteById(groupId),
    'Member group deleted',
    (args) => deleteMutationInvalidationFn('member-group', args)
)

export const useMemberGroups = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberGroupPaginated, string> & IQueryProps = {}) => {
    return useQuery<IMemberGroup[], string>({
        queryKey: ['member-group', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(GroupService.allList())

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
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGroupPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberGroupPaginated, string>({
        queryKey: [
            'member-group',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GroupService.search({
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
