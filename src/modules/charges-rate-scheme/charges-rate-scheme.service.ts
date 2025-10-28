import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    ICharegesRateSchemeCreateRequest,
    IChargesRateScheme,
    IChargesRateSchemeRequest,
    TChargesRateSchemeHookMode,
} from '../charges-rate-scheme'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: chargesRateSchemeBaseKey,
} = createDataLayerFactory<IChargesRateScheme, IChargesRateSchemeRequest>({
    url: '/api/v1/charges-rate-scheme',
    baseKey: 'charges-rate-scheme',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: chargesRateSchemeAPIRoute, // matches url above

    create: createChargesRateScheme,
    updateById: updateChargesRateSchemeById,

    deleteById: deleteChargesRateSchemeById,
    deleteMany: deleteManyChargesRateScheme,

    getById: getChargesRateSchemeById,
    getAll: getAllChargesRateScheme,
    getPaginated: getPaginatedChargesRateScheme,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { chargesRateSchemeBaseKey } // Exported in case it's needed outside

export const {
    // useCreate: useCreateChargesRateScheme,
    useUpdateById: useUpdateChargesRateSchemeById,

    // useGetAll: useGetAllChargesRateScheme,
    useGetById: useGetChargesRateSchemeById,
    useGetPaginated: useGetPaginatedChargesRateScheme,

    useDeleteById: useDeleteChargesRateSchemeById,
    useDeleteMany: useDeleteManyChargesRateScheme,
} = apiCrudHooks

// custom create since not all is required in create

export const useCreateChargesRateScheme = createMutationFactory<
    IChargesRateScheme,
    Error,
    ICharegesRateSchemeCreateRequest
>({
    mutationFn: async (payload) => {
        const response = await API.post<
            ICharegesRateSchemeCreateRequest,
            IChargesRateScheme
        >(`${chargesRateSchemeAPIRoute}`, payload)
        return response.data
    },
    defaultInvalidates: [
        [chargesRateSchemeBaseKey, 'paginated'],
        [chargesRateSchemeBaseKey, 'all'],
    ],
})

export const useGetAllChargesRateScheme = ({
    mode = 'all',
    currencyId,
    query,
    options,
}: {
    mode?: TChargesRateSchemeHookMode
    currencyId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IChargesRateScheme[], Error>
} = {}) => {
    return useQuery<IChargesRateScheme[], Error>({
        ...options,
        queryKey: [
            chargesRateSchemeBaseKey,
            'all',
            mode,
            currencyId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url = `${chargesRateSchemeAPIRoute}`

            if (mode === 'currency') {
                url = `${chargesRateSchemeAPIRoute}/currency/${currencyId}`
            }

            return await getAllChargesRateScheme({
                url,
                query,
            })
        },
    })
}

export const logger = Logger.getInstance('charges-rate-scheme')
// custom hooks can go here
