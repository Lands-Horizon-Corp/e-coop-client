import {
    useQuery,
    useMutation,
    QueryClient,
    UseQueryResult,
    useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'

import { IAPIHook, IMutationProps, IQueryProps } from '@/types/api-hooks-types'

export const createMutationHook =
    <TData, TError = string, TVariables = void>(
        mutationFn: (variables: TVariables) => Promise<TData>,
        successMessage?: string,
        invalidateFn?: (
            queryClient: QueryClient,
            variables: TVariables,
            data: TData
        ) => void
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
                invalidateFn?.(queryClient, variables, result)
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

// export const createQueryHook =
//     <TData, TError = string, TVariables = void>(
//         queryKey: unknown[],
//         queryFn: (variables?: TVariables) => Promise<TData>,
//         initialData?: TData
//     ) =>
//     ({
//         enabled = true,
//         showMessage = true,
//         ...options
//     }: IQueryProps<TData> & { variables?: TVariables } = {}) => {
//         return useQuery<TData, TError>({
//             queryKey,
//             queryFn: async () => {
//                 const [error, result] = await withCatchAsync(
//                     queryFn(options.variables)
//                 )
//                 if (error) {
//                     const errorMessage = serverRequestErrExtractor({ error })
//                     if (showMessage) toast.error(errorMessage)
//                     throw errorMessage
//                 }
//                 return result
//             },
//             enabled,
//             initialData,
//             ...options,
//         })
//     }
