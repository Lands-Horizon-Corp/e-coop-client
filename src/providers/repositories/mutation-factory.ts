import {
    MutationOptions,
    QueryClient,
    QueryKey,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'

import { TEntityId } from '@/types'

export type HookMutationOptions<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
> = Omit<MutationOptions<TQueryFnData, TError, TData>, 'mutationFn'>

// Factory for creating mutations (HOC)
type TInvalidationFn<TResponse = unknown, TVariables = unknown> = {
    resultData: TResponse
    variables: TVariables
    queryClient: QueryClient
}

export const createMutationFactory = <
    TResponse,
    TError = Error,
    TVariables = unknown,
>({
    mutationFn,
    defaultInvalidates,
    invalidationFn,
}: {
    mutationFn: (variables: TVariables) => Promise<TResponse>
    defaultInvalidates?: Array<QueryKey>
    invalidationFn?: (args: TInvalidationFn<TResponse, TVariables>) => void
}) => {
    return ({
        options,
    }: {
        options?: HookMutationOptions<TResponse, TError, TVariables> & {
            meta?: { invalidates?: Array<QueryKey> }
        }
    } = {}) => {
        const queryClient = useQueryClient()

        return useMutation<TResponse, TError, TVariables>({
            ...options,
            mutationFn,
            meta: {
                invalidates: options?.meta?.invalidates || defaultInvalidates,
            },
            onSuccess: (resultData, variables, context) => {
                if (invalidationFn) {
                    invalidationFn({ resultData, variables, queryClient })
                }

                options?.onSuccess?.(resultData, variables, context)
            },
        })
    }
}

// Use for create mutations only
export const createMutationInvalidateFn = <TData extends { id: TEntityId }>(
    rootKey: string,
    { resultData, queryClient }: TInvalidationFn<TData, unknown>
) => {
    // Remove specific loader queries for the created item
    queryClient.removeQueries({
        queryKey: [rootKey, 'loader', resultData.id],
    })

    // Set the newly created data in the cache
    queryClient.setQueryData([rootKey, resultData.id], resultData)

    // Add the new data to the 'all' query list
    queryClient.setQueryData<TData[]>([rootKey, 'all'], (oldDatas = []) => [
        resultData,
        ...oldDatas,
    ])

    // Invalidate paginated
    queryClient.invalidateQueries({
        exact: false,
        queryKey: [rootKey, 'paginated'],
    })
}

// Use for update mutations only
export const updateMutationInvalidationFn = <
    TData extends { id: TEntityId },
    TPayload = unknown,
>(
    rootKey: string,
    {
        resultData,
        queryClient,
    }: TInvalidationFn<TData & { id: TEntityId }, TPayload>
) => {
    // Remove specific loader queries for the updated item
    queryClient.removeQueries({
        queryKey: [rootKey, 'loader', resultData.id],
    })

    // Update the specific item in the cache
    queryClient.setQueryData([rootKey, resultData.id], resultData)

    // Update the item in the 'all' query list
    queryClient.setQueryData<TData[]>([rootKey, 'all'], (oldDatas = []) => {
        const index = oldDatas.findIndex((val) => val.id === resultData.id)
        if (index === -1) return oldDatas // If not found, return the original array

        const updatedDatas = [...oldDatas]
        updatedDatas[index] = resultData // Replace the item at the found index
        return updatedDatas
    })

    // Invalidate paginated to ensure consistency
    queryClient.invalidateQueries({
        queryKey: [rootKey, 'paginated'],
    })
}

// pang delete mutations only
export const deleteMutationInvalidationFn = <
    TData extends { id: TEntityId } | void,
    TPayload,
    TExistingQueryData extends { id: TEntityId },
>(
    rootKey: string,
    { variables, queryClient }: TInvalidationFn<TData, TPayload>
) => {
    // Remove specific loader queries for the deleted item
    queryClient.removeQueries({
        queryKey: [rootKey, 'loader', variables],
    })

    // Remove the specific item from the cache
    queryClient.setQueryData([rootKey, variables], undefined)

    // Invalidate and remove the specific query for the deleted item
    queryClient.invalidateQueries({
        queryKey: [rootKey, variables],
        exact: true,
    })
    queryClient.removeQueries({ queryKey: [rootKey, variables], exact: true })

    // Remove the deleted item from the 'all' query list
    queryClient.setQueryData<TExistingQueryData[]>(
        [rootKey, 'all'],
        (oldDatas = []) => oldDatas.filter((val) => val.id !== variables)
    )

    // Invalidate resource-query to ensure consistency
    queryClient.invalidateQueries({
        queryKey: [rootKey, 'paginated'],
    })
}
