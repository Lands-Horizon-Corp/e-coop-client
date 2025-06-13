import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    createQueryHook,
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '../api-hook-factory'
import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberOccupationService from '@/api-service/member-services/member-occupation-service'

import {
    TEntityId,
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
    (data) => MemberOccupationService.createMemberOccupation(data),
    'Member Occupation Created',
    (args) => createMutationInvalidateFn('member-occupation', args)
)

export const useUpdateMemberOccupation = createMutationHook<
    IMemberOccupation,
    string,
    { occupationId: TEntityId; data: IMemberOccupationRequest }
>(
    ({ occupationId, data }) =>
        MemberOccupationService.updateMemberOccupation(occupationId, data),
    'Member Occupation Updated',
    (args) => updateMutationInvalidationFn('member-occupation', args)
)

export const useDeleteMemberOccupation = createMutationHook<
    void,
    string,
    TEntityId
>(
    (occupationId) =>
        MemberOccupationService.removeMemberOccupation(occupationId),
    'Member Occupation Deleted',
    (args) => deleteMutationInvalidationFn('member-occupation', args)
)

export const useMemberOccupations = createQueryHook<
    IMemberOccupation[],
    string
>(
    ['member-occupation', 'all'],
    () => MemberOccupationService.getAllMemberOccupation(),
    []
)

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
                MemberOccupationService.getPaginatedMemberOccupation({
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
