import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMutualFund,
    IMutualFundPostRequest,
    IMutualFundPrintRequest,
    IMutualFundRequest,
    IMutualFundView,
} from '../mutual-fund'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: mutualFundBaseKey,
} = createDataLayerFactory<IMutualFund, IMutualFundRequest>({
    url: '/api/v1/mutual-fund',
    baseKey: 'mutual-fund',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: mutualFundAPIRoute, // matches url above

    create: createMutualFund,
    updateById: updateMutualFundById,

    deleteById: deleteMutualFundById,
    deleteMany: deleteManyMutualFund,

    getById: getMutualFundById,
    getAll: getAllMutualFund,
    getPaginated: getPaginatedMutualFund,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { mutualFundBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateMutualFund,
    useUpdateById: useUpdateMutualFundById,

    useGetAll: useGetAllMutualFund,
    useGetById: useGetMutualFundById,
    useGetPaginated: useGetPaginatedMutualFund,

    useDeleteById: useDeleteMutualFundById,
    useDeleteMany: useDeleteManyMutualFund,
} = apiCrudHooks

// Process button - this processes but does not yet save the mutual fund entry
export const useGenerateMutualFundProcessView = createMutationFactory<
    IMutualFundView,
    Error,
    Omit<IMutualFundRequest, 'entries'>
>({
    mutationFn: async (payload) => {
        const response = await API.post<typeof payload, IMutualFundView>(
            `${mutualFundAPIRoute}/view`,
            payload
        )

        return response.data
    },
    defaultInvalidates: [[mutualFundBaseKey, 'paginated']],
})

// Get all mutual fund entries for this mutual fund
export const useGetMutualFundEntry = ({
    query,
    options,
    mutualFundId,
}: {
    mutualFundId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMutualFundView, Error>
}) => {
    return useQuery<IMutualFundView, Error>({
        ...options,
        queryKey: [
            mutualFundBaseKey,
            mutualFundId,
            'mutual-fund-entry',
            'all',
            query,
        ].filter(Boolean),
        queryFn: async () => {
            const response = await API.get<IMutualFundView>(
                `${mutualFundAPIRoute}/${mutualFundId}/view`
            )
            return response.data
        },
    })
}

// PRINT
export const usePrintMutualFund = createMutationFactory<
    IMutualFund,
    Error,
    { mutualFundId: TEntityId; payload: IMutualFundPrintRequest }
>({
    mutationFn: async ({ mutualFundId, payload }) => {
        const response = await API.put<IMutualFundPrintRequest, IMutualFund>(
            `${mutualFundAPIRoute}/${mutualFundId}/print`,
            payload
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(mutualFundBaseKey, args),
    defaultInvalidates: [[mutualFundBaseKey, 'paginated']],
})

// RE-PRINT
export const useReprintMutualFund = createMutationFactory<
    IMutualFund,
    Error,
    { mutualFundId: TEntityId }
>({
    mutationFn: async ({ mutualFundId }) => {
        const response = await API.put<void, IMutualFund>(
            `${mutualFundAPIRoute}/${mutualFundId}/print-only`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(mutualFundBaseKey, args),
    defaultInvalidates: [[mutualFundBaseKey, 'paginated']],
})

// UNDO PRINT
export const useUndoPrintMutualFund = createMutationFactory<
    IMutualFund,
    Error,
    { mutualFundId: TEntityId }
>({
    mutationFn: async ({ mutualFundId }) => {
        const response = await API.put<void, IMutualFund>(
            `${mutualFundAPIRoute}/${mutualFundId}/print-undo`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(mutualFundBaseKey, args),
    defaultInvalidates: [[mutualFundBaseKey, 'paginated']],
})

// POST The mutual fund
export const usePostMutualFund = createMutationFactory<
    IMutualFund,
    Error,
    {
        mutualFundId: TEntityId
        payload: Omit<IMutualFundPostRequest, 'entries'>
    }
>({
    mutationFn: async ({ mutualFundId, payload }) => {
        const response = await API.put<typeof payload, IMutualFund>(
            `${mutualFundAPIRoute}/${mutualFundId}/post`,
            payload
        )

        return response.data
    },
    invalidationFn: ({ queryClient, variables }) => {
        queryClient.invalidateQueries({
            queryKey: [mutualFundBaseKey, variables.mutualFundId],
        })
        queryClient.invalidateQueries({
            queryKey: [
                mutualFundBaseKey,
                variables.mutualFundId,
                'mutual-fund-entry',
                'all',
            ],
        })
    },
    defaultInvalidates: [[mutualFundBaseKey, 'paginated']],
})

export const logger = Logger.getInstance('mutual-fund')
// custom hooks can go here
