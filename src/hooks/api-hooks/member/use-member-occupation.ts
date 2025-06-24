import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberOccupationService from '@/api-service/member-services/member-occupation-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMemberOccupation,
    IMemberOccupationRequest,
    IAPIFilteredPaginatedHook,
    IMemberOccupationPaginated,
} from '@/types'

export const useCreateMemberOccupation = createMutationHook<
    IMemberOccupation,
    string,
    IMemberOccupationRequest
>(
    (data) => MemberOccupationService.create(data),
    'Member Occupation Created',
    (args) => createMutationInvalidateFn('member-occupation', args)
)

export const useUpdateMemberOccupation = createMutationHook<
    IMemberOccupation,
    string,
    { occupationId: TEntityId; data: IMemberOccupationRequest }
>(
    ({ occupationId, data }) =>
        MemberOccupationService.updateById(occupationId, data),
    'Member Occupation Updated',
    (args) => updateMutationInvalidationFn('member-occupation', args)
)

export const useDeleteMemberOccupation = createMutationHook<
    void,
    string,
    TEntityId
>(
    (occupationId) => MemberOccupationService.deleteById(occupationId),
    'Member Occupation Deleted',
    (args) => deleteMutationInvalidationFn('member-occupation', args)
)

export const useMemberOccupations = ({
    enabled,
    showMessage,
}: IAPIHook<IMemberOccupation[], string> & IQueryProps = {}) => {
    return useQuery<IMemberOccupation[], string>({
        queryKey: ['member-occupation', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberOccupationService.allList()
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

export const useFilteredPaginatedMemberOccupations = ({
    sort,
    enabled,
    showMessage,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberOccupationPaginated, string> = {}) => {
    return useQuery<IMemberOccupationPaginated, string>({
        queryKey: [
            'member-occupation',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberOccupationService.search({
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
