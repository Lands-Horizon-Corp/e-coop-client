import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import {
    IInvitationCode,
    IInvitationCodePaginated,
    IInvitationCodeRequest,
} from './invitation-code.types'

const { apiCrudHooks } = createDataLayerFactory<
    IInvitationCode,
    IInvitationCodeRequest
>({
    url: '/api/v1/invitation-code',
    baseKey: 'invitation-code',
})

export const { useCreate, useUpdateById, useDeleteById } = apiCrudHooks

const { API } = createAPIRepository('/api/v1/invitation-code')

// API Functions
export const verifyInvitationCode = async (code: string) => {
    const response = await API.get<IInvitationCode>(`/code/${code}`)
    return response.data
}

export const getPaginatedInvitationCode = async (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}
    const endpoint = `/search`
    const response = await API.get<IInvitationCodePaginated>(endpoint, {
        params: {
            sort,
            filter: filters,
            pageIndex: pagination?.pageIndex,
            pageSize: pagination?.pageSize,
        },
    })
    return response.data
}

export const bulkDeleteInvitationCodes = async (ids: TEntityId[]) => {
    const endpoint = `/bulk-delete`
    await API.delete<void>(endpoint, { data: { ids } })
}

// Hooks
export const useVerifyInvitationCode = (code: string) => {
    return useQuery<IInvitationCode, Error>({
        queryKey: ['invitation-code', 'verify', code],
        queryFn: () => verifyInvitationCode(code),
        enabled: !!code,
    })
}

export const useGetPaginatedInvitationCodes = (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    return useQuery<IInvitationCodePaginated>({
        queryKey: ['invitation-code', 'paginated', props],
        queryFn: () => getPaginatedInvitationCode(props),
        placeholderData: (previousData) => previousData,
    })
}

export const useBulkDeleteInvitationCodes = (
    options?: UseMutationOptions<void, Error, TEntityId[]>
) => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, TEntityId[]>({
        mutationFn: bulkDeleteInvitationCodes,
        onSuccess: () => {
            toast.success('Selected invitation codes have been deleted.')
            queryClient.invalidateQueries({ queryKey: ['invitation-code'] })
        },
        onError: (error) => {
            toast.error('Failed to delete invitation codes.')
            console.error(error)
        },
        ...options,
    })
}
