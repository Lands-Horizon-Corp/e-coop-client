import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    IOperationCallbacks,
    IAPIPreloads,
    IFilterPaginatedHookProps,
    IQueryProps,
} from '../types'
import {
    IChequePaginatedResource,
    IChequeResource,
    IChequeResponse,
} from '@/server/types/cheque'
import ChequeService from '@/server/api-service/accounting-services/accounting-cheque'
import { TEntityId } from '@/server/types'

export const useFilteredPaginatedCheques = ({
    sort,
    enabled,
    filterPayload,
    preloads,
    pagination = { pageSize: 20, pageIndex: 1 },
}: IFilterPaginatedHookProps & IQueryProps = {}) => {
    return useQuery<IChequePaginatedResource, string>({
        queryKey: [
            'cheques',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                ChequeService.getCheques({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
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

export const useCreateCheque = ({
    preloads = [],
    onError,
    onSuccess,
}: IOperationCallbacks<IChequeResource> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, IChequeResponse>({
        mutationKey: ['cheques', 'create'],
        mutationFn: async (newChequeData) => {
            const [error, data] = await withCatchAsync(
                ChequeService.create(newChequeData, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData<IChequeResource>(
                ['cheques', data.id],
                data
            )
            toast.success('Cheque Created')
            onSuccess?.(data)
        },
    })
}

export const useUpdateCheque = ({
    preloads,
    onSuccess,
    onError,
}: IOperationCallbacks<IChequeResource, string> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<
        IChequeResource,
        string,
        { id: TEntityId; data: IChequeResponse }
    >({
        mutationKey: ['cheques', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, response] = await withCatchAsync(
                ChequeService.update(id, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (onError) onError(errorMessage)
                else toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData<IChequeResource>(['cheques', id], response)
            toast.success('Cheque Updated')
            onSuccess?.(response)
            return response
        },
    })
}

export const useDeleteCheque = ({
    onSuccess,
    onError,
}: undefined | IOperationCallbacks<undefined> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['cheques', 'delete'],
        mutationFn: async (chequeId) => {
            const [error] = await withCatchAsync(ChequeService.delete(chequeId))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.invalidateQueries({
                queryKey: ['cheques', 'resource-query'],
            })
            toast.success('Cheque deleted')
            onSuccess?.(undefined)
        },
    })
}
