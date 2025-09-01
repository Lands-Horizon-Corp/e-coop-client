import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IBrowseExcludeIncludeAccounts,
    IBrowseExcludeIncludeAccountsRequest,
} from '../browse-exclude-include-accounts'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: browseExcludeIncludeAccountsBaseKey,
} = createDataLayerFactory<
    IBrowseExcludeIncludeAccounts,
    IBrowseExcludeIncludeAccountsRequest
>({
    url: '/api/v1/browse-exclude-include-accounts',
    baseKey: 'browse-exclude-include-accounts',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: browseExcludeIncludeAccountsAPIRoute, // matches url above

    create: createBrowseExcludeIncludeAccounts,
    updateById: updateBrowseExcludeIncludeAccountsById,

    deleteById: deleteBrowseExcludeIncludeAccountsById,
    deleteMany: deleteManyBrowseExcludeIncludeAccounts,

    getById: getBrowseExcludeIncludeAccountsById,
    getAll: getAllBrowseExcludeIncludeAccounts,
    getPaginated: getPaginatedBrowseExcludeIncludeAccounts,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { browseExcludeIncludeAccountsBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateBrowseExcludeIncludeAccounts,
    useUpdateById: useUpdateBrowseExcludeIncludeAccountsById,

    // useGetAll: useGetAllBrowseExcludeIncludeAccounts,
    useGetById: useGetBrowseExcludeIncludeAccountsById,
    useGetPaginated: useGetPaginatedBrowseExcludeIncludeAccounts,

    useDeleteById: useDeleteBrowseExcludeIncludeAccountsById,
    useDeleteMany: useDeleteManyBrowseExcludeIncludeAccounts,
} = apiCrudHooks

// custom hooks can go here

export const useGetAllBrowseExcludeIncludeAccounts = ({
    computationSheetId,
    query,
    options,
}: {
    computationSheetId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IBrowseExcludeIncludeAccounts[], Error>
}) => {
    return useQuery<IBrowseExcludeIncludeAccounts[], Error>({
        ...options,
        queryKey: [
            browseExcludeIncludeAccountsBaseKey,
            'all',
            'scheme',
            computationSheetId,
            query,
        ],
        queryFn: async () =>
            getAllBrowseExcludeIncludeAccounts({
                query,
                url: `${browseExcludeIncludeAccountsAPIRoute}/computation-sheet/${computationSheetId}`,
            }),
    })
}
