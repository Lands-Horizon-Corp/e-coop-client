import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as MemberTypeService from '@/api-service/member-services/member-type/member-type-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMemberType,
    IMutationProps,
    IMemberTypeRequest,
    IMemberTypePaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const memberTypeLoader = (
    memberTypeId: TEntityId,
    preloads: string[] = []
) =>
    queryOptions<IMemberType>({
        queryKey: ['member-type', 'loader', memberTypeId],
        queryFn: async () => {
            const data = await MemberTypeService.getMemberTypeById(
                memberTypeId,
                preloads
            )
            return data
        },
        retry: 0,
    })

export const useCreateMemberType = ({
    preloads = [],
    showMessage = true,
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMemberType, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberType, string, IMemberTypeRequest>({
        mutationKey: ['member-type', 'create'],
        mutationFn: async (data) => {
            const [error, newMemberType] = await withCatchAsync(
                MemberTypeService.createMemberType(data, preloads)
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
}: IAPIHook<IMemberType, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        void,
        string,
        { memberTypeId: TEntityId; data: IMemberTypeRequest }
    >({
        mutationKey: ['member-type', 'update'],
        mutationFn: async ({ memberTypeId, data }) => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.updateMemberType(memberTypeId, data, preloads)
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
                MemberTypeService.deleteMemberType(memberTypeId)
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

export const useMemberTypes = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberType[], string> & IQueryProps = {}) => {
    return useQuery<IMemberType[], string>({
        queryKey: ['member-types', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.getAllMemberTypes()
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

export const useFilteredPaginatedMemberTypes = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberTypePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberTypePaginated, string>({
        queryKey: [
            'member-type',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberTypeService.getPaginatedMemberTypes({
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
