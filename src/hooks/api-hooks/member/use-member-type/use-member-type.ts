import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberTypeService from '@/server/api-service/member-services/member-type/member-type-service'

import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IAPIFilteredPaginatedHook,
} from '../../types'
import {
    TEntityId,
    IMemberTypeRequest,
    IMemberTypeResource,
    IMemberTypePaginatedResource,
} from '@/server/types'

export const memberTypeLoader = (
    memberTypeId: TEntityId,
    preloads: string[] = []
) =>
    queryOptions<IMemberTypeResource>({
        queryKey: ['member-type', 'loader', memberTypeId],
        queryFn: async () => {
            const data = await MemberTypeService.getById(memberTypeId, preloads)
            return data
        },
        retry: 0,
    })

export const useCreateMemberType = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMemberTypeResource, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberTypeResource, string, IMemberTypeRequest>({
        mutationKey: ['member-type', 'create'],
        mutationFn: async (data) => {
            const [error, newMemberType] = await withCatchAsync(
                MemberTypeService.create(data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-type', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type', newMemberType.id],
            })
            queryClient.removeQueries({
                queryKey: ['member-type', 'loader', newMemberType.id],
            })

            if (showMessage) toast.success('New Member Type Created')
            onSuccess?.(newMemberType)

            return newMemberType
        },
    })
}

export const useUpdateMemberType = ({
    showMessage = true,
    preloads = ['Owner', 'Media', 'Owner.Media'],
    onSuccess,
    onError,
}: IAPIHook<IMemberTypeResource, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { memberTypeId: TEntityId; data: IMemberTypeRequest }
    >({
        mutationKey: ['member-type', 'update'],
        mutationFn: async ({ memberTypeId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.update(memberTypeId, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-type', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type', memberTypeId],
            })
            queryClient.removeQueries({
                queryKey: ['member-type', 'loader', memberTypeId],
            })

            if (showMessage) toast.success('Member Type updated')
            onSuccess?.(result)
        },
    })
}

export const useDeleteMemberType = ({
    showMessage = false,
    onSuccess,
    onError,
}: IAPIHook & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['member-type', 'delete'],
        mutationFn: async (memberTypeId) => {
            const [error] = await withCatchAsync(
                MemberTypeService.delete(memberTypeId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member-type', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member-type', memberTypeId],
            })
            queryClient.removeQueries({
                queryKey: ['member-type', 'loader', memberTypeId],
            })

            if (showMessage) toast.success('Member Type deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useFilteredPaginatedMemberTypes = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypePaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberTypePaginatedResource, string>({
        queryKey: [
            'member-type',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.getMemberTypes({
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
            data: [
                {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Gold Member',
                    description: 'Premium membership with exclusive perks',
                    prefix: 'GOLD',
                    createdAt: '2024-03-12T10:00:00Z',
                    updatedAt: '2024-03-12T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '3b241101-e2bb-4255-8caf-4136c566a962',
                    name: 'Silver Member',
                    description: 'Standard membership with some perks',
                    prefix: 'SILV',
                    createdAt: '2024-03-11T10:00:00Z',
                    updatedAt: '2024-03-11T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '2a3f3a8e-5f07-4c0b-9bb5-91e0c11d3b46',
                    name: 'Bronze Member',
                    description: 'Basic membership with limited perks',
                    prefix: 'BRNZ',
                    createdAt: '2024-03-10T10:00:00Z',
                    updatedAt: '2024-03-10T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    name: 'Platinum Member',
                    description: 'Highest tier membership',
                    prefix: 'PLAT',
                    createdAt: '2024-03-09T10:00:00Z',
                    updatedAt: '2024-03-09T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
                    name: 'VIP Member',
                    description: 'Exclusive membership with top-tier benefits',
                    prefix: 'VIP',
                    createdAt: '2024-03-08T10:00:00Z',
                    updatedAt: '2024-03-08T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '1d0f8c5c-41be-4adf-a98d-1ff3f3dcf3dc',
                    name: 'Regular Member',
                    description: 'Entry-level membership',
                    prefix: 'BASIC',
                    createdAt: '2024-03-07T10:00:00Z',
                    updatedAt: '2024-03-07T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '7e3a5c3f-09c3-4f95-90ab-3a5aee35e9b5',
                    name: 'Elite Member',
                    description: 'Membership for elite customers',
                    prefix: 'ELITE',
                    createdAt: '2024-03-06T10:00:00Z',
                    updatedAt: '2024-03-06T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '4fd63a22-8e1d-49f1-9a52-55f3b4672a98',
                    name: 'Corporate Member',
                    description: 'Membership for corporate accounts',
                    prefix: 'CORP',
                    createdAt: '2024-03-05T10:00:00Z',
                    updatedAt: '2024-03-05T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '1d2e82bf-2a5c-45b2-bc96-1b15ef33f19c',
                    name: 'Student Member',
                    description: 'Special membership for students',
                    prefix: 'STUD',
                    createdAt: '2024-03-04T10:00:00Z',
                    updatedAt: '2024-03-04T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: 'fa9d54e1-71c9-4ea1-a3f6-28a12c5c3491',
                    name: 'Senior Member',
                    description: 'Membership for senior citizens',
                    prefix: 'SENIOR',
                    createdAt: '2024-03-03T10:00:00Z',
                    updatedAt: '2024-03-03T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '5d99a3f2-b87b-44eb-80ec-1210a2a5d77d',
                    name: 'Family Member',
                    description: 'Membership for family members',
                    prefix: 'FAMILY',
                    createdAt: '2024-03-02T10:00:00Z',
                    updatedAt: '2024-03-02T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '9c7ae6cd-3262-4148-bf4f-46fa4e7c91d9',
                    name: 'Sports Member',
                    description: 'Membership for sports enthusiasts',
                    prefix: 'SPORT',
                    createdAt: '2024-03-01T10:00:00Z',
                    updatedAt: '2024-03-01T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: 'dc27b37f-4137-4f5f-94a2-20f75291f0e5',
                    name: 'Fitness Member',
                    description: 'Membership for gym and fitness lovers',
                    prefix: 'FIT',
                    createdAt: '2024-02-29T10:00:00Z',
                    updatedAt: '2024-02-29T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: 'e89b53f1-9e67-4c62-bc91-2e8912c1e7fb',
                    name: 'Travel Member',
                    description: 'Membership for frequent travelers',
                    prefix: 'TRAVEL',
                    createdAt: '2024-02-28T10:00:00Z',
                    updatedAt: '2024-02-28T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '41f0931b-2c92-489f-b45e-c6b99a8f2b3b',
                    name: 'Foodie Member',
                    description: 'Membership for food lovers',
                    prefix: 'FOODIE',
                    createdAt: '2024-02-27T10:00:00Z',
                    updatedAt: '2024-02-27T12:00:00Z',
                    deletedAt: null,
                },
                {
                    id: '9ff97d5d-8e49-4d62-9a5f-776b9a7f41a1',
                    name: 'Music Member',
                    description: 'Membership for music lovers',
                    prefix: 'MUSIC',
                    createdAt: '2024-02-26T10:00:00Z',
                    updatedAt: '2024-02-26T12:00:00Z',
                    deletedAt: null,
                },
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
