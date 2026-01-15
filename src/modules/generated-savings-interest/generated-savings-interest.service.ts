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
    IGenerateSavingsInterestPostRequest,
    IGeneratedSavingsInterest,
    IGeneratedSavingsInterestPrintRequest,
    IGeneratedSavingsInterestRequest,
    IGeneratedSavingsInterestView,
} from '../generated-savings-interest'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generatedSavingsInterestBaseKey,
} = createDataLayerFactory<
    IGeneratedSavingsInterest,
    IGeneratedSavingsInterestRequest
>({
    url: '/api/v1/generated-savings-interest',
    baseKey: 'generated-savings-interest',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: generatedSavingsInterestAPIRoute, // matches url above

    create: createGeneratedSavingsInterest,
    updateById: updateGeneratedSavingsInterestById,

    deleteById: deleteGeneratedSavingsInterestById,
    deleteMany: deleteManyGeneratedSavingsInterest,

    getById: getGeneratedSavingsInterestById,
    getAll: getAllGeneratedSavingsInterest,
    getPaginated: getPaginatedGeneratedSavingsInterest,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { generatedSavingsInterestBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateGeneratedSavingsInterest,
    useUpdateById: useUpdateGeneratedSavingsInterestById,

    useGetAll: useGetAllGeneratedSavingsInterest,
    useGetById: useGetGeneratedSavingsInterestById,
    useGetPaginated: useGetPaginatedGeneratedSavingsInterest,

    useDeleteById: useDeleteGeneratedSavingsInterestById,
    useDeleteMany: useDeleteManyGeneratedSavingsInterest,
} = apiCrudHooks

// Process button in old Coop
// this process, but does not yet save the generated entry
export const useGenerateSavingsInterestProcessView = createMutationFactory<
    IGeneratedSavingsInterestView,
    Error,
    Omit<IGeneratedSavingsInterestRequest, 'entries'>
>({
    mutationFn: async (payload) => {
        const response = await API.post<
            typeof payload,
            IGeneratedSavingsInterestView
        >(`${generatedSavingsInterestAPIRoute}/view`, payload)

        return response.data
    },
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'paginated']],
})

// Get all savings interest for this generated savings interest
export const useGetGeneratedSavingsInterestEntry = ({
    query,
    options,
    generatedSavingsInterestId,
}: {
    generatedSavingsInterestId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGeneratedSavingsInterestView, Error>
}) => {
    return useQuery<IGeneratedSavingsInterestView, Error>({
        ...options,
        queryKey: [
            generatedSavingsInterestBaseKey,
            generatedSavingsInterestId,
            'generated-savings-interest-entry',
            'all',
            query,
        ].filter(Boolean),
        queryFn: async () => {
            const response = await API.get<IGeneratedSavingsInterestView>(
                `${generatedSavingsInterestAPIRoute}/${generatedSavingsInterestId}/view`
            )
            return response.data
        },
    })
}

// PRINT
export const usePrintGeneratedSavingsInterest = createMutationFactory<
    IGeneratedSavingsInterest,
    Error,
    {
        generatedSavingsInterestId: TEntityId
        payload: IGeneratedSavingsInterestPrintRequest
    }
>({
    mutationFn: async ({ generatedSavingsInterestId }) => {
        const response = await API.put<void, IGeneratedSavingsInterest>(
            `${generatedSavingsInterestAPIRoute}/${generatedSavingsInterestId}/print`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(generatedSavingsInterestBaseKey, args),
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'paginated']],
})

// RE-PRINT
export const useReprintGeneratedSavingsInterest = createMutationFactory<
    IGeneratedSavingsInterest,
    Error,
    {
        generatedSavingsInterestId: TEntityId
        payload: IGeneratedSavingsInterestPrintRequest
    }
>({
    mutationFn: async ({ generatedSavingsInterestId, payload }) => {
        const response = await API.put<
            IGeneratedSavingsInterestPrintRequest,
            IGeneratedSavingsInterest
        >(
            `${generatedSavingsInterestAPIRoute}/${generatedSavingsInterestId}/print-only`,
            payload
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(generatedSavingsInterestBaseKey, args),
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'paginated']],
})

// UNDO PRINT
export const useUndoPrintGeneratedSavingsInterest = createMutationFactory<
    IGeneratedSavingsInterest,
    Error,
    { generatedSavingsInterestId: TEntityId }
>({
    mutationFn: async ({ generatedSavingsInterestId }) => {
        const response = await API.put<void, IGeneratedSavingsInterest>(
            `${generatedSavingsInterestAPIRoute}/${generatedSavingsInterestId}/print-undo`
        )
        return response.data
    },
    invalidationFn: (args) =>
        updateMutationInvalidationFn(generatedSavingsInterestBaseKey, args),
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'paginated']],
})

// POST The generated savings interest
export const usePostGeneratedSavingsInterest = createMutationFactory<
    IGeneratedSavingsInterest,
    Error,
    {
        generatedSavingsId: TEntityId
        payload: IGenerateSavingsInterestPostRequest
    }
>({
    mutationFn: async ({ generatedSavingsId, payload }) => {
        const response = await API.put<
            typeof payload,
            IGeneratedSavingsInterest
        >(
            `${generatedSavingsInterestAPIRoute}/${generatedSavingsId}/post`,
            payload
        )

        return response.data
    },
    invalidationFn: ({ queryClient, variables }) => {
        queryClient.invalidateQueries({
            queryKey: [
                generatedSavingsInterestBaseKey,
                variables.generatedSavingsId,
            ],
        })
        queryClient.invalidateQueries({
            queryKey: [
                generatedSavingsInterestBaseKey,
                variables.generatedSavingsId,
                'generated-savings-interest-entry',
                'all',
            ],
        })
    },
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'paginated']],
})

export const logger = Logger.getInstance('generated-savings-interest')
// custom hooks can go here
