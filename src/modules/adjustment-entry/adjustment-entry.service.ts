import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IAdjustmentEntry,
    IAdjustmentEntryPaginated,
    IAdjustmentEntryRequest,
    IAdjustmentEntryTotal,
    TAdjustmentEntryHookMode,
} from '../adjustment-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: adjustmentEntryBaseKey,
} = createDataLayerFactory<IAdjustmentEntry, IAdjustmentEntryRequest>({
    url: '/api/v1/adjustment-entry',
    baseKey: 'adjustment-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: adjustmentEntryAPIRoute, // matches url above

    create: createAdjustmentEntry,
    updateById: updateAdjustmentEntryById,

    deleteById: deleteAdjustmentEntryById,
    deleteMany: deleteManyAdjustmentEntry,

    getById: getAdjustmentEntryById,
    getAll: getAllAdjustmentEntry,
    getPaginated: getPaginatedAdjustmentEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { adjustmentEntryBaseKey } // Exported in case it's needed outside

export const {
    // useCreate: useCreateAdjustmentEntry,
    useUpdateById: useUpdateAdjustmentEntryById,

    useGetAll: useGetAllAdjustmentEntry,
    useGetById: useGetAdjustmentEntryById,
    // useGetPaginated: useGetPaginatedAdjustmentEntry,

    useDeleteById: useDeleteAdjustmentEntryById,
    useDeleteMany: useDeleteManyAdjustmentEntry,
} = apiCrudHooks

export const useCreateAdjustmentEntry = createMutationFactory<
    IAdjustmentEntry,
    Error,
    IAdjustmentEntryRequest
>({
    mutationFn: (payload) => createAdjustmentEntry({ payload }),
    defaultInvalidates: [
        ['auth', 'context'],
        [adjustmentEntryBaseKey, 'paginated'],
        [adjustmentEntryBaseKey, 'all'],
    ],
})

export const useAdjustmentEntryTotal = ({
    options,
    mode = 'all',
    userOrganizationId,
    currencyId,
}: {
    mode?: TAdjustmentEntryHookMode
    options?: HookQueryOptions<IAdjustmentEntryTotal, Error>
    userOrganizationId?: TEntityId
    currencyId?: TEntityId
}) => {
    return useQuery<IAdjustmentEntryTotal, Error>({
        ...options,
        queryKey: [
            'adjustment-entry',
            'total',
            mode,
            userOrganizationId,
            currencyId,
        ].filter(Boolean),
        queryFn: async (): Promise<IAdjustmentEntryTotal> => {
            let url = `${adjustmentEntryAPIRoute}/total`

            if (mode === 'currency' && userOrganizationId && currencyId) {
                url = `${adjustmentEntryAPIRoute}/currency/${currencyId}/total`
            }

            if (
                mode === 'currency-employee' &&
                userOrganizationId &&
                currencyId
            ) {
                url = `${adjustmentEntryAPIRoute}/currency/${currencyId}/employee/${userOrganizationId}/total`
            }

            const res = await API.get(url)
            return res.data as IAdjustmentEntryTotal
        },
    })
}

export const useGetPaginatedAdjustmentEntry = ({
    query,
    options,
    mode = 'all',
    userOrganizationId,
    currencyId,
}: {
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IAdjustmentEntryPaginated, Error>
    mode?: TAdjustmentEntryHookMode
    userOrganizationId?: TEntityId
    currencyId?: TEntityId
}) => {
    return useQuery<IAdjustmentEntryPaginated, Error>({
        ...options,
        queryKey: [
            adjustmentEntryBaseKey,
            'paginated',
            mode,
            userOrganizationId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url = `${adjustmentEntryAPIRoute}/search`

            if (mode === 'currency' && userOrganizationId && currencyId) {
                url = `${adjustmentEntryAPIRoute}/currency/${currencyId}/search`
            }

            if (
                mode === 'currency-employee' &&
                userOrganizationId &&
                currencyId
            ) {
                url = `${adjustmentEntryAPIRoute}/currency/${currencyId}/employee/${userOrganizationId}/search`
            }

            return getPaginatedAdjustmentEntry({ query, url })
        },
    })
}

export const logger = Logger.getInstance('adjustment-entry')
