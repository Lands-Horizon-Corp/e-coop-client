import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as GenderService from '@/api-service/member-services/member-gender-service'

import {
    IAPIHook,
    TEntityId,
    IQueryProps,
    IMemberGender,
    IOperationCallbacks,
    IMemberGenderRequest,
    IMemberGenderPaginated,
    IAPIFilteredPaginatedHook,
} from '@/types'

export const useCreateGender = ({
    showMessage = true,
    onError,
    onSuccess,
}: IAPIHook<IMemberGender, string> & IQueryProps = {}) => {
    const queryClient = useQueryClient()

    return useMutation<IMemberGender, string, IMemberGenderRequest>({
        mutationKey: ['gender', 'create'],
        mutationFn: async (data) => {
            const [error, newGender] = await withCatchAsync(
                GenderService.createMemberGender(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['gender', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['gender', newGender.id],
            })
            queryClient.removeQueries({
                queryKey: ['gender', 'loader', newGender.id],
            })

            if (showMessage) toast.success('New Gender Created')
            onSuccess?.(newGender)

            return newGender
        },
    })
}

export const useUpdateGender = ({
    onError,
    onSuccess,
}: IOperationCallbacks<IMemberGender, string> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<
        IMemberGender,
        string,
        { genderId: TEntityId; data: IMemberGenderRequest }
    >({
        mutationKey: ['gender', 'update'],
        mutationFn: async ({ genderId, data }) => {
            const [error, result] = await withCatchAsync(
                GenderService.updateMemberGender(genderId, data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['gender', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['gender', genderId],
            })
            queryClient.removeQueries({
                queryKey: ['gender', 'loader', genderId],
            })

            toast.success('Gender updated')
            onSuccess?.(result)

            return result
        },
    })
}

export const useDeleteGender = ({
    onError,
    onSuccess,
}: IOperationCallbacks = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['gender', 'delete'],
        mutationFn: async (genderId) => {
            const [error] = await withCatchAsync(
                GenderService.deleteMemberGender(genderId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.invalidateQueries({
                queryKey: ['gender', 'resource-query'],
            })
            queryClient.invalidateQueries({
                queryKey: ['gender', genderId],
            })
            queryClient.removeQueries({
                queryKey: ['gender', 'loader', genderId],
            })

            toast.success('Gender deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useGenders = ({
    enabled,
    showMessage = true,
}: IAPIHook<IMemberGender[], string> & IQueryProps = {}) => {
    return useQuery<IMemberGender[], string>({
        queryKey: ['gender', 'resource-query', 'all'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GenderService.getAllMemberGenders()
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

export const useFilteredPaginatedGenders = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IMemberGenderPaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IMemberGenderPaginated, string>({
        queryKey: ['gender', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GenderService.getPaginatedMemberGenders({
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
