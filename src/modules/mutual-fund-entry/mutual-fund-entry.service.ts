import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IMutualFundEntry,
    IMutualFundEntryRequest,
} from '../mutual-fund-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: mutualFundEntryBaseKey,
} = createDataLayerFactory<IMutualFundEntry, IMutualFundEntryRequest>({
    url: '/api/v1/mutual-fund-entry',
    baseKey: 'mutual-fund-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: mutualFundEntryAPIRoute, // matches url above

    // create: createMutualFundEntry,
    updateById: updateMutualFundEntryById,

    deleteById: deleteMutualFundEntryById,
    deleteMany: deleteManyMutualFundEntry,

    getById: getMutualFundEntryById,
    getAll: getAllMutualFundEntry,
    getPaginated: getPaginatedMutualFundEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { mutualFundEntryBaseKey } // Exported in case it's needed outside

export const {
    // useCreate: useCreateMutualFundEntry,
    // useUpdateById: useUpdateMutualFundEntryById,

    useGetAll: useGetAllMutualFundEntry,
    useGetById: useGetMutualFundEntryById,
    useGetPaginated: useGetPaginatedMutualFundEntry,

    // useDeleteById: useDeleteMutualFundEntryById,
    useDeleteMany: useDeleteManyMutualFundEntry,
} = apiCrudHooks

export const useDeleteMutualFundEntryById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteMutualFundEntryById({ id }),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [mutualFundEntryBaseKey],
        })
        deleteMutationInvalidationFn(mutualFundEntryBaseKey, args)
    },
})

export const useCreateMutualFundEntry = createMutationFactory<
    IMutualFundEntry,
    Error,
    IMutualFundEntryRequest
>({
    mutationFn: async (payload) =>
        getMutualFundEntryById({
            id: payload.id || '',
            url: `${mutualFundEntryAPIRoute}`,
        }),
    defaultInvalidates: [
        [mutualFundEntryBaseKey, 'paginated'],
        [mutualFundEntryBaseKey, 'all'],
    ],
})

export const useUpdateMutualFundEntryById = createMutationFactory<
    IMutualFundEntry,
    Error,
    { id: TEntityId; payload: IMutualFundEntryRequest }
>({
    mutationFn: async (variables) => {
        const response = await updateMutualFundEntryById({
            id: variables.id,
            payload: variables.payload,
        })
        return response
    },
    invalidationFn: (args) => {
        updateMutationInvalidationFn(mutualFundEntryBaseKey, args)
    },
})

export const logger = Logger.getInstance('mutual-fund-entry')
// custom hooks can go here
