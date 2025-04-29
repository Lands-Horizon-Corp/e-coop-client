import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    IQueryProps,
    IAPIPreloads,
    IOperationCallbacks,
    IFilterPaginatedHookProps,
} from '../types'
import { TEntityId } from '@/types'
import {
    IAccountsPaginatedResource,
    IAccountsRequest,
    IAccountsResource,
} from '@/types/coop-types/accounts/accounts'
import AccountsService from '@/api-service/accounting-services/accounts-service'

export const useFilteredPaginatedAccounts = ({
    sort,
    enabled = true,
    filterPayload,
    preloads,
    pagination = { pageSize: 20, pageIndex: 1 },
}: IFilterPaginatedHookProps & IQueryProps = {}) => {
    return useQuery<IAccountsPaginatedResource, string>({
        queryKey: [
            'accounts',
            'resource-query',
            { filterPayload, pagination, sort },
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                AccountsService.getAccounts({
                    preloads,
                    pagination,
                    sort: sort ? toBase64(sort) : undefined,
                    filters: filterPayload
                        ? toBase64(filterPayload)
                        : undefined,
                })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        staleTime: 1000 * 60 * 2,
        enabled,
        retry: 1,
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
    })
}

export const useDeleteAccounts = ({
    onSuccess,
    onError,
}: undefined | IOperationCallbacks<undefined> = {}) => {
    const queryClient = useQueryClient()
    return useMutation<void, string, TEntityId>({
        mutationFn: async (accountsId) => {
            const [error] = await withCatchAsync(
                AccountsService.delete(accountsId)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw new Error(errorMessage)
            }
            await queryClient.invalidateQueries({
                queryKey: ['accounts', 'resource-query'],
            })
            queryClient.removeQueries({ queryKey: ['accounts', accountsId] })
            toast.success('Account deleted successfully')
            onSuccess?.(undefined)
        },
    })
}

export const useCreateAccounts = ({
    preloads = [],
    onError,
    onSuccess,
}: IOperationCallbacks<IAccountsResource> & IAPIPreloads) => {
    const queryClient = useQueryClient()
    return useMutation<void, string, IAccountsRequest>({
        mutationKey: ['accounts', 'create'],
        mutationFn: async (newAccountData) => {
            const [error, data] = await withCatchAsync(
                AccountsService.create(newAccountData, preloads)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
            await queryClient.invalidateQueries({
                queryKey: ['accounts', 'resource-query'],
            })
            toast.success('Accounts Created')
            onSuccess?.(data)
        },
    })
}

export const useUpdateAccounts = ({
    preloads,
    onSuccess,
    onError,
}: IOperationCallbacks<IAccountsResource, string> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<
        IAccountsResource,
        string,
        {
            id: TEntityId
            data: IAccountsRequest
        }
    >({
        mutationKey: ['accounts', 'update'],
        mutationFn: async ({ id, data }) => {
            const [error, response] = await withCatchAsync(
                AccountsService.update(id, data, preloads)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(errorMessage) || toast.error(errorMessage)
                throw errorMessage
            }
            const cachedAccount = queryClient.getQueryData<IAccountsResource>([
                'accounts',
                id,
            ])
            if (cachedAccount) {
                queryClient.setQueryData<IAccountsResource>(['accounts', id], {
                    ...cachedAccount,
                    ...response,
                })
            }
            await queryClient.invalidateQueries({
                queryKey: ['accounts', 'resource-query'],
            })
            toast.success('Account updated successfully')
            onSuccess?.(response)
            return response
        },
    })
}
