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
    IAccountsComputationTypePaginatedResource,
    IAccountsComputationTypeRequest,
    IAccountsComputationTypeResource,
} from '@/server/types/accounts/computation-type'
import ComputationTypeService from '@/server/api-service/accounting-services/computation-type-service'
import { TEntityId } from '@/server/types'

export const useFilteredPaginatedComputationTypes = ({
    sort,
    enabled,
    filterPayload,
    preloads,
    pagination = { pageSize: 20, pageIndex: 1 },
}: IFilterPaginatedHookProps & IQueryProps = {}) => {
    return useQuery<IAccountsComputationTypePaginatedResource, string>({
        queryKey: [
            'computation-types',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                ComputationTypeService.getComputationTypes({
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

export const useDeleteComputationType = ({
    onSuccess,
    onError,
}: undefined | IOperationCallbacks<undefined> = {}) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, TEntityId>({
        mutationKey: ['computation-types', 'delete'],
        mutationFn: async (computationTypeId) => {
            const [error] = await withCatchAsync(
                ComputationTypeService.delete(computationTypeId)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }

            queryClient.invalidateQueries({
                queryKey: ['computation-types', 'resource-query'],
            })

            queryClient.invalidateQueries({
                queryKey: ['computation-types', computationTypeId],
            })
            queryClient.removeQueries({
                queryKey: ['computation-types', 'loader', computationTypeId],
            })

            toast.success('Computation type deleted')
            onSuccess?.(undefined)
        },
    })
}

export const useCreateComputationType = ({
    preloads = [],
    onError,
    onSuccess,
}: IOperationCallbacks<IAccountsComputationTypeResource> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, IAccountsComputationTypeRequest>({
        mutationKey: ['computation-types', 'create'],
        mutationFn: async (newComputationTypeData) => {
            const [error, data] = await withCatchAsync(
                ComputationTypeService.create(newComputationTypeData, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            queryClient.setQueryData<IAccountsComputationTypeResource>(
                ['computation-types', data.id],
                data
            )

            queryClient.setQueryData<IAccountsComputationTypeResource>(
                ['computation-types', 'loader', data.id],
                data
            )

            toast.success('Computation Type Created')
            onSuccess?.(data)
        },
    })
}

export const useUpdateComputationType = ({
    preloads,
    onSuccess,
    onError,
}: IOperationCallbacks<IAccountsComputationTypeResource, string> &
    IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<
        IAccountsComputationTypeResource,
        string,
        {
            id: TEntityId
            data: IAccountsComputationTypeRequest
        }
    >({
        mutationKey: ['computation-types', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, response] = await withCatchAsync(
                ComputationTypeService.update(id, data, preloads)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (onError) onError(errorMessage)
                else toast.error(errorMessage)
                throw errorMessage
            }

            queryClient.setQueriesData<IAccountsComputationTypePaginatedResource>(
                {
                    queryKey: ['computation-types', 'resource-query'],
                    exact: false,
                },
                (oldData) => {
                    if (!oldData) return oldData

                    return {
                        ...oldData,
                        data: oldData.data.map((compType) =>
                            compType.id === id ? response : compType
                        ),
                    }
                }
            )

            queryClient.setQueryData<IAccountsComputationTypeResource>(
                ['computation-types', id],
                response
            )

            queryClient.setQueryData<IAccountsComputationTypeResource>(
                ['computation-types', 'loader', id],
                response
            )

            toast.success('Computation Type Updated')

            onSuccess?.(response)
            return response
        },
    })
}
