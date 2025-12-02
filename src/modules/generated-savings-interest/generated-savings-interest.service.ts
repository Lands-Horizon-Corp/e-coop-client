import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IGeneratedSavingsInterest,
    IGeneratedSavingsInterestRequest,
    IGeneratedSavingsInterestView,
} from '../generated-savings-interest'
import { IGeneratedSavingsInterestEntry } from '../generated-savings-interest-entry'

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
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'all', 'view']],
})

// Get all savings interest for this generated savings interest

export const useGetAllGeneratedSavingsInterestEntry = ({
    query,
    options,
    generatedSavingsInterestId,
}: {
    generatedSavingsInterestId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGeneratedSavingsInterestEntry[], Error>
}) => {
    return useQuery<IGeneratedSavingsInterestEntry[], Error>({
        ...options,
        queryKey: [
            generatedSavingsInterestBaseKey,
            generatedSavingsInterestId,
            'generated-savings-interest-entry',
            'all',
            query,
        ].filter(Boolean),
        queryFn: async () => {
            const response =
                await getAllGeneratedSavingsInterest<IGeneratedSavingsInterestEntry>(
                    {
                        query,
                        url: `${generatedSavingsInterestAPIRoute}/generated-savings-interest/${generatedSavingsInterestId}/view`,
                    }
                )
            return response
        },
    })
}

export const logger = Logger.getInstance('generated-savings-interest')
// custom hooks can go here
