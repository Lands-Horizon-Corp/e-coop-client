import {
    UseQueryResult,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import {
    IAPIHook,
    IInvalidateFnArgs,
    IMutationProps,
    IQueryProps,
    TEntityId,
} from '@/types'

export const createMutationHook =
    <TData, TError = string, TVariables = void>(
        mutationFn: (variables: TVariables) => Promise<TData>,
        successMessage?: string,
        invalidateFn?: (args: IInvalidateFnArgs<TData, TVariables>) => void
    ) =>
    ({
        onError,
        onSuccess,
        showMessage = true,
    }: IAPIHook<TData, TError> & IMutationProps = {}) => {
        const queryClient = useQueryClient()

        return useMutation<TData, TError, TVariables>({
            mutationFn: async (variables) => {
                const [error, result] = await withCatchAsync(
                    mutationFn(variables)
                )
                if (error) {
                    const errorMessage = serverRequestErrExtractor({ error })
                    if (showMessage) toast.error(errorMessage)
                    onError?.(errorMessage, error as TError)
                    throw errorMessage
                }
                if (showMessage && successMessage) toast.success(successMessage)
                onSuccess?.(result)
                invalidateFn?.({
                    queryClient,
                    payload: variables,
                    resultData: result,
                })
                return result
            },
        })
    }

// PANG QUERY

export function createQueryHook<TData, TError = string, TVariables = void>(
    queryKey: unknown[],
    queryFn: (variables?: TVariables) => Promise<TData>,
    initialData: TData
): (
    props?: IQueryProps<TData> & TVariables
) => Omit<UseQueryResult<TData, TError>, 'data'> & { data: TData }

export function createQueryHook<TData, TError = string, TVariables = void>(
    queryKey: unknown[],
    queryFn: (variables?: TVariables) => Promise<TData>
): (props?: IQueryProps<TData> & TVariables) => UseQueryResult<TData, TError>

export function createQueryHook<TData, TError = string, TVariables = void>(
    queryKey: unknown[],
    queryFn: (variables?: TVariables) => Promise<TData>,
    initialData?: TData
) {
    return ({
        enabled = true,
        showMessage = true,
        ...options
    }: IQueryProps<TData> & { variables?: TVariables } = {}) => {
        const query = useQuery<TData, TError>({
            queryKey,
            queryFn: async () => {
                const [error, result] = await withCatchAsync(
                    queryFn(options.variables)
                )
                if (error) {
                    const errorMessage = serverRequestErrExtractor({ error })
                    if (showMessage) toast.error(errorMessage)
                    throw errorMessage
                }
                return result
            },
            enabled,
            retry: 1,
            ...(initialData !== undefined ? { initialData } : {}),
            ...options,
        })

        return {
            ...query,
            data: query.data as TData,
        }
    }
}

// FOR INVALIDATION
export const createMutationInvalidateFn = <TData extends { id: TEntityId }>(
    rootKey: string,
    {
        resultData,
        queryClient,
    }: IInvalidateFnArgs<TData & { id: TEntityId }, unknown>
) => {
    queryClient.removeQueries({
        queryKey: [rootKey, 'loader', resultData.id],
    })

    queryClient.setQueryData([rootKey, resultData.id], resultData)

    queryClient.setQueryData<TData[]>([rootKey, 'all'], (oldDatas = []) => {
        const oldDatasCopy = [...oldDatas]
        const index = oldDatas.findIndex((val) => val.id === resultData.id)

        if (index === -1) return oldDatas

        oldDatasCopy.splice(index, 1, resultData)
        return oldDatasCopy
    })

    queryClient.invalidateQueries({
        exact: false,
        queryKey: [rootKey, 'resource-query'],
    })
}

export const updateMutationInvalidationFn = <
    TData extends { id: TEntityId },
    TPayload = unknown,
>(
    rootKey: string,
    {
        resultData,
        queryClient,
    }: IInvalidateFnArgs<TData & { id: TEntityId }, TPayload>
) => {
    queryClient.removeQueries({
        queryKey: [rootKey, 'loader', resultData.id],
    })

    queryClient.setQueryData([rootKey, resultData.id], resultData)

    queryClient.setQueryData<TData[]>([rootKey, 'all'], (oldDatas = []) => {
        const oldDatasCopy = [...oldDatas]
        const index = oldDatas.findIndex((val) => val.id === resultData.id)

        if (index === -1) return oldDatas

        oldDatasCopy.splice(index, 1, resultData)
        return oldDatasCopy
    })

    queryClient.invalidateQueries({
        queryKey: [rootKey, 'resource-query'],
    })
}

export const deleteMutationInvalidationFn = <
    TData extends { id: TEntityId } | void,
    TPayload,
    TExistingQueryData extends { id: TEntityId },
>(
    rootKey: string,
    { payload, queryClient }: IInvalidateFnArgs<TData, TPayload>
) => {
    queryClient.removeQueries({
        queryKey: [rootKey, 'loader', payload],
    })

    queryClient.removeQueries({ queryKey: [rootKey, payload] })
    queryClient.setQueryData<TExistingQueryData[]>(
        [rootKey, 'all'],
        (oldDatas = []) => oldDatas.filter((val) => val.id !== payload)
    )
    queryClient.invalidateQueries({
        queryKey: [rootKey, 'resource-query'],
    })
}
