import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IAPIFilteredPaginatedHook,
} from '../../types'
import { TEntityId } from '@/types'
import { toBase64, withCatchAsync } from '@/utils'
import {
    IMemberTypeReferenceRequest,
    IMemberTypeReferenceResource,
    IMemberTypeReferencePaginatedResource,
} from '@/types/coop-types/member/member-type-reference'
import { serverRequestErrExtractor } from '@/helpers'
import MemberTypeReferenceService from '@/api-service/member-services/member-type/member-type-reference-service'

export const useCreateMemberTypeReference = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}:
    | undefined
    | (IAPIHook<IMemberTypeReferenceResource, string> &
          IMutationProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberTypeReferenceResource,
        string,
        IMemberTypeReferenceRequest
    >({
        mutationKey: ['member-type-reference', 'create'],
        mutationFn: async (data) => {
            const [error, newMemberTypeReference] = await withCatchAsync(
                MemberTypeReferenceService.create(data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: [
                    'member-type-reference',
                    data.memberTypeId,
                    'resource-query',
                ],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type-reference', data.memberTypeId],
            })

            if (showMessage) toast.success('New Member Type Reference Created')
            onSuccess?.(newMemberTypeReference)

            return newMemberTypeReference
        },
    })
}

export const useUpdateMemberTypeReference = ({
    showMessage = true,
    preloads = ['Owner', 'Media', 'Owner.Media'],
    onSuccess,
    onError,
}: IAPIHook<IMemberTypeReferenceResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { memberTypeReferenceId: TEntityId; data: IMemberTypeReferenceRequest }
    >({
        mutationKey: ['member-type-reference', 'update'],
        mutationFn: async ({ memberTypeReferenceId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberTypeReferenceService.update(
                    memberTypeReferenceId,
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
                queryKey: [
                    'member-type-reference',
                    data.memberTypeId,
                    'resource-query',
                ],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type-reference', memberTypeReferenceId],
            })

            queryClient.removeQueries({
                queryKey: [
                    'member-type-reference',
                    'loader',
                    memberTypeReferenceId,
                ],
            })

            if (showMessage) toast.success('Member Type Reference updated')
            onSuccess?.(result)
        },
    })
}

export const useFilteredPaginatedMemberTypeReferences = ({
    sort,
    enabled,
    memberTypeId,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypeReferencePaginatedResource, string> & {
    memberTypeId: TEntityId
} & IQueryProps) => {
    return useQuery<IMemberTypeReferencePaginatedResource, string>({
        queryKey: [
            'member-type-reference',
            memberTypeId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeReferenceService.getMemberTypeReferences({
                    preloads,
                    pagination,
                    memberTypeId,
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
            data: [
                // {
                //     id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
                //     accountId: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
                //     memberTypeId: '550e8400-e29b-41d4-a716-446655440000',
                //     maintainingBalance: 1000,
                //     description: 'Regular Member Type A',
                //     interestRate: 0.05,
                //     minimumBalance: 500,
                //     charges: 10,
                //     activeMemberMinimumBalance: 750,
                //     activeMemberRatio: 0.8,
                //     otherInterestOnSavingComputationMinimumBalance: 2000,
                //     otherInterestOnSavingComputationInterestRate: 0.06,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'bcdefa01-2345-6789-abcd-ef0123456789',
                //     updatedById: '98765432-10fe-dcba-9876-543210fedcba',
                // },
                // {
                //     id: '1a2b3c4d-5e6f-7890-1234-567890abcdef',
                //     accountId: 'fedcba98-7654-3210-0fed-cba987654321',
                //     memberTypeId: '550e8400-e29b-41d4-a716-446655440000',
                //     maintainingBalance: 5000,
                //     description: 'Premium Member Type B',
                //     interestRate: 0.07,
                //     minimumBalance: 2500,
                //     charges: 0,
                //     activeMemberMinimumBalance: 3000,
                //     activeMemberRatio: 0.9,
                //     otherInterestOnSavingComputationMinimumBalance: 5000,
                //     otherInterestOnSavingComputationInterestRate: 0.08,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'ef012345-6789-abcd-ef01-23456789abcd',
                //     updatedById: '87654321-0fed-cba9-8765-43210fedcba9',
                // },
                // {
                //     id: 'b2c3d4e5-f678-9012-3456-7890abcdef01',
                //     accountId: '8d7c6b5a-4321-0fed-cba9-876543210fed',
                //     memberTypeId: '550e8400-e29b-41d4-a716-446655440000',
                //     maintainingBalance: 1200,
                //     description: 'Regular Member Type A - Updated',
                //     interestRate: 0.055,
                //     minimumBalance: 600,
                //     charges: 12,
                //     activeMemberMinimumBalance: 800,
                //     activeMemberRatio: 0.85,
                //     otherInterestOnSavingComputationMinimumBalance: 2200,
                //     otherInterestOnSavingComputationInterestRate: 0.065,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'cdef0123-4567-89ab-cdef-0123456789ab',
                //     updatedById: '76543210-fedc-ba98-7654-3210fedcba98',
                // },
                // {
                //     id: '2b3c4d5e-6f78-9012-3456-7890abcdef01',
                //     accountId: '7c6b5a43-210f-edcb-a987-6543210fedcb',
                //     memberTypeId: '550e8400-e29b-41d4-a716-446655440000',
                //     maintainingBalance: 200,
                //     description: 'Basic Member Type C',
                //     interestRate: 0.03,
                //     minimumBalance: 100,
                //     charges: 5,
                //     activeMemberMinimumBalance: 150,
                //     activeMemberRatio: 0.7,
                //     otherInterestOnSavingComputationMinimumBalance: 500,
                //     otherInterestOnSavingComputationInterestRate: 0.04,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'def01234-5678-9abc-def0-123456789abc',
                //     updatedById: '6543210f-edcb-a987-6543-210fedcba987',
                // },
                // {
                //     id: 'c3d4e5f6-7890-1234-5678-90abcdef0123',
                //     accountId: '6b5a4321-0fed-cba9-8765-43210fedcba9',
                //     memberTypeId: '456789ab-cdef-0123-4567-89abcdef012345',
                //     maintainingBalance: 6000,
                //     description: 'Premium Member Type B - Special',
                //     interestRate: 0.075,
                //     minimumBalance: 3000,
                //     charges: 0,
                //     activeMemberMinimumBalance: 3500,
                //     activeMemberRatio: 0.95,
                //     otherInterestOnSavingComputationMinimumBalance: 6000,
                //     otherInterestOnSavingComputationInterestRate: 0.085,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: '01234567-89ab-cdef-0123-456789abcdef',
                //     updatedById: '543210fe-dcba-9876-5432-10fedcba9876',
                // },
                // {
                //     id: '3c4d5e6f-7890-1234-5678-90abcdef0123',
                //     accountId: '5a43210f-edcb-a987-6543-210fedcba987',
                //     memberTypeId: '56789abc-def0-1234-5678-9abcdef0123456',
                //     maintainingBalance: 1100,
                //     description: 'Regular Member Type A - Version 2',
                //     interestRate: 0.052,
                //     minimumBalance: 550,
                //     charges: 11,
                //     activeMemberMinimumBalance: 780,
                //     activeMemberRatio: 0.82,
                //     otherInterestOnSavingComputationMinimumBalance: 2100,
                //     otherInterestOnSavingComputationInterestRate: 0.062,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'fabcde01-2345-6789-abcd-ef0123456789',
                //     updatedById: '43210fed-cba9-8765-4321-0fedcba98765',
                // },
                // {
                //     id: 'd4e5f678-9012-3456-7890-abcdef012345',
                //     accountId: '43210fed-cba9-8765-4321-0fedcba98765',
                //     memberTypeId: '6789abcd-ef01-2345-6789-abcdef01234567',
                //     maintainingBalance: 15000,
                //     description: 'VIP Member Type D',
                //     interestRate: 0.09,
                //     minimumBalance: 10000,
                //     charges: 0,
                //     activeMemberMinimumBalance: 12000,
                //     activeMemberRatio: 0.98,
                //     otherInterestOnSavingComputationMinimumBalance: 15000,
                //     otherInterestOnSavingComputationInterestRate: 0.1,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'e012345f-6789-abcd-ef01-23456789abcd',
                //     updatedById: '3210fedc-ba98-7654-3210-fedcba987654',
                // },
                // {
                //     id: '4e5f6789-0123-4567-89ab-cdef01234567',
                //     accountId: '3210fedc-ba98-7654-3210-fedcba987654',
                //     memberTypeId: '789abcdef0-1234-5678-9abc-def0123456789',
                //     maintainingBalance: 250,
                //     description: 'Basic Member Type C - Lite',
                //     interestRate: 0.035,
                //     minimumBalance: 125,
                //     charges: 6,
                //     activeMemberMinimumBalance: 175,
                //     activeMemberRatio: 0.75,
                //     otherInterestOnSavingComputationMinimumBalance: 600,
                //     otherInterestOnSavingComputationInterestRate: 0.045,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: 'f012345e-6789-abcd-ef01-23456789abcd',
                //     updatedById: '210fedcb-a987-6543-210f-edcba9876543',
                // },
                // {
                //     id: '5f6789ab-cdef-0123-4567-89abcdef0123',
                //     accountId: '210fedcb-a987-6543-210f-edcba9876543',
                //     memberTypeId: '89abcdef01-2345-6789-abcd-ef0123456789a',
                //     maintainingBalance: 5500,
                //     description: 'Premium Member Type B - Standard',
                //     interestRate: 0.072,
                //     minimumBalance: 2750,
                //     charges: 0,
                //     activeMemberMinimumBalance: 3200,
                //     activeMemberRatio: 0.92,
                //     otherInterestOnSavingComputationMinimumBalance: 5500,
                //     otherInterestOnSavingComputationInterestRate: 0.082,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: '12345678-9abc-def0-1234-567890abcdef',
                //     updatedById: '0fedcba9-8765-4321-0fed-cba987654321',
                // },
                // {
                //     id: '6789abcd-ef01-2345-6789-abcdef012345',
                //     accountId: '0fedcba9-8765-4321-0fed-cba987654321',
                //     memberTypeId: '9abcdef012-3456-789a-bcde-f0123456789a',
                //     maintainingBalance: 1050,
                //     description: 'Regular Member Type A - Initial',
                //     interestRate: 0.051,
                //     minimumBalance: 525,
                //     charges: 10.5,
                //     activeMemberMinimumBalance: 765,
                //     activeMemberRatio: 0.81,
                //     otherInterestOnSavingComputationMinimumBalance: 2050,
                //     otherInterestOnSavingComputationInterestRate: 0.061,
                //     createdAt: '2025-04-21T18:09:00Z',
                //     updatedAt: '2025-04-21T18:09:00Z',
                //     createdById: '9abcdef0-1234-5678-9abc-def012345678',
                //     updatedById: 'fedcba98-7654-3210-0fed-cba987654321',
                // },
            ],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}
