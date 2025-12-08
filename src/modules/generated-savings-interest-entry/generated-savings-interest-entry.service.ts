import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IGeneratedSavingsInterestEntry,
    IGeneratedSavingsInterestEntryDailyBalanceView,
    IGeneratedSavingsInterestEntryRequest,
} from '../generated-savings-interest-entry'
import {
    createGeneratedSavingsInterest,
    generatedSavingsInterestBaseKey,
} from '../generated-savings-interest/generated-savings-interest.service'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generatedSavingsInterestEntryBaseKey,
} = createDataLayerFactory<
    IGeneratedSavingsInterestEntry,
    IGeneratedSavingsInterestEntryRequest
>({
    url: '/api/v1/generated-savings-interest-entry',
    baseKey: 'generated-savings-interest-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: generatedSavingsInterestEntryAPIRoute, // matches url above

    // create: createGeneratedSavingsInterestEntry,
    updateById: updateGeneratedSavingsInterestEntryById,

    deleteById: deleteGeneratedSavingsInterestEntryById,
    deleteMany: deleteManyGeneratedSavingsInterestEntry,

    getById: getGeneratedSavingsInterestEntryById,
    getAll: getAllGeneratedSavingsInterestEntry,
    getPaginated: getPaginatedGeneratedSavingsInterestEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { generatedSavingsInterestEntryBaseKey } // Exported in case it's needed outside

export const {
    // useCreate: useCreateGeneratedSavingsInterestEntry,
    // useUpdateById: useUpdateGeneratedSavingsInterestEntryById,

    // useGetAll: useGetAllGeneratedSavingsInterestEntry,
    useGetById: useGetGeneratedSavingsInterestEntryById,
    useGetPaginated: useGetPaginatedGeneratedSavingsInterestEntry,

    // useDeleteById: useDeleteGeneratedSavingsInterestEntryById,
    useDeleteMany: useDeleteManyGeneratedSavingsInterestEntry,
} = apiCrudHooks

export const useGetGeneratedSavingsInterestDailyBalance = ({
    id,
    options,
}: {
    id: TEntityId
    options?: HookQueryOptions<
        IGeneratedSavingsInterestEntryDailyBalanceView,
        Error
    >
}) => {
    return useQuery<IGeneratedSavingsInterestEntryDailyBalanceView, Error>({
        ...options,
        queryKey: [generatedSavingsInterestBaseKey, id, 'daily-balance'],
        queryFn: async () =>
            await getGeneratedSavingsInterestEntryById<IGeneratedSavingsInterestEntryDailyBalanceView>(
                {
                    id,
                    url: `${generatedSavingsInterestEntryAPIRoute}/${id}/daily-balance`,
                }
            ),
    })
}

export const useDeleteGeneratedSavingsInterestEntryById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteGeneratedSavingsInterestEntryById({ id }),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [generatedSavingsInterestBaseKey],
        })
        args.queryClient.invalidateQueries({
            queryKey: [generatedSavingsInterestEntryBaseKey],
        })
        deleteMutationInvalidationFn(generatedSavingsInterestBaseKey, args)
    },
})

export const useCreateGeneratedSavingsInterestEntry = createMutationFactory<
    IGeneratedSavingsInterestEntry,
    Error,
    IGeneratedSavingsInterestEntryRequest
>({
    mutationFn: async (payload) =>
        createGeneratedSavingsInterest({
            payload: payload,
            url: `${generatedSavingsInterestEntryAPIRoute}/generated-savings-interest/${payload.generated_savings_interest_id}`,
        }),
    invalidationFn: ({
        queryClient,
        variables: { generated_savings_interest_id },
    }) => {
        queryClient.invalidateQueries({
            queryKey: [
                generatedSavingsInterestBaseKey,
                generated_savings_interest_id,
                'generated-savings-interest-entry',
                'all',
            ],
        })
    },
    defaultInvalidates: [
        [generatedSavingsInterestEntryBaseKey, 'paginated'],
        [generatedSavingsInterestEntryBaseKey, 'all'],
    ],
})

export const useUpdateGeneratedSavingsInterestEntryById = createMutationFactory<
    IGeneratedSavingsInterestEntry,
    Error,
    { id: TEntityId; payload: IGeneratedSavingsInterestEntryRequest }
>({
    mutationFn: async (variables) => {
        const response = await updateGeneratedSavingsInterestEntryById({
            id: variables.id,
            payload: variables.payload,
        })
        return response
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [
                generatedSavingsInterestBaseKey,
                args.resultData.generated_savings_interest_id,
                'generated-savings-interest-entry',
                'all',
            ],
        })

        updateMutationInvalidationFn(generatedSavingsInterestEntryBaseKey, args)
    },
})

export const logger = Logger.getInstance('generated-savings-interest-entry')
// custom hooks can go here
