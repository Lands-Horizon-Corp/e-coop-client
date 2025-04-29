import {
    useQuery,
    useMutation,
    queryOptions,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import MemberService from '@/api-service/member-services/member-service'

import {
    TEntityId,
    IMemberRequest,
    IMedia,
    IMember,
    IMemberPaginatedResource,
    IMemberRequestNoPassword,
} from '@/types'
import {
    IAPIHook,
    IQueryProps,
    IMutationProps,
    IAPIFilteredPaginatedHook,
} from '../types'

export const memberLoader = (
    memberId: TEntityId,
    preloads: string[] = ['Media']
) =>
    queryOptions<IMember>({
        queryKey: ['member', 'loader', memberId],
        queryFn: async () => {
            const data = await MemberService.getById(memberId, preloads)
            return data
        },
        retry: 0,
    })

export const useCreateMember = ({
    showMessage = true,
    preloads = ['Media'],
    onSuccess,
    onError,
}: undefined | (IAPIHook<IMember, string> & IQueryProps) = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMember, string, IMemberRequest>({
        mutationKey: ['member', 'create'],
        mutationFn: async (data) => {
            const [error, newMember] = await withCatchAsync(
                MemberService.create(data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member', newMember.id],
            })
            queryClient.removeQueries({
                queryKey: ['member', 'loader', newMember.id],
            })

            if (showMessage) toast.success('New Member Account Created')
            onSuccess?.(newMember)

            return newMember
        },
    })
}

export const useUpdateMember = ({
    showMessage = true,
    preloads = ['Media'],
    onSuccess,
    onError,
}: IAPIHook<IMember, string> & IQueryProps) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMember,
        string,
        {
            id: TEntityId
            data: IMemberRequest | IMemberRequestNoPassword
        }
    >({
        mutationKey: ['member', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, updatedMember] = await withCatchAsync(
                MemberService.update(id, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['member', updatedMember.id],
            })
            queryClient.removeQueries({
                queryKey: ['member', 'loader', updatedMember.id],
            })

            if (showMessage) toast.success('Member account details updated')
            onSuccess?.(updatedMember)

            return updatedMember
        },
    })
}

export const useDeleteMember = ({
    showMessage = true,
    onSuccess,
    onError,
}: IAPIHook<unknown, string> & IMutationProps) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['member', 'delete'],
        mutationFn: async (memberId) => {
            const [error] = await withCatchAsync(MemberService.delete(memberId))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['member', 'resource-query'],
            })

            queryClient.invalidateQueries({ queryKey: ['member', memberId] })
            queryClient.removeQueries({
                queryKey: ['member', 'loader', memberId],
            })

            if (showMessage) toast.success('Member deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useMemberMedias = ({
    memberId,
    onError,
    onSuccess,
    showMessage,
    ...other
}: { memberId: TEntityId } & IQueryProps<IMedia[]> &
    Omit<IAPIHook<IMedia[], string>, 'preloads'>) => {
    return useQuery<IMedia[], string>({
        queryKey: ['member', memberId, 'medias'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                MemberService.getMedias(memberId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)

            return data
        },
        ...other,
    })
}

export const useFilteredPaginatedMembers = ({
    sort,
    enabled,
    showMessage = true,
    filterPayload,
    preloads = ['memberProfile', 'memberProfile.media'],
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberPaginatedResource, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberPaginatedResource, string>({
        queryKey: ['member', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                MemberService.getMembers({
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
