import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import { memberTypeBaseQueryKey } from '../member-type'
import type {
    IBrowseReference,
    IBrowseReferencePaginated,
    IBrowseReferenceRequest,
} from './browse-reference.types'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: browseReferenceBaseKey,
} = createDataLayerFactory<IBrowseReference, IBrowseReferenceRequest>({
    url: '/api/v1/browse-reference',
    baseKey: 'browse-reference',
})

// ⚙️🛠️ API SERVICE HERE
// Expose API for custom queries
export const {
    API,
    create: createBrowseReference,
    route: browseReferenceAPIRoute,
    getPaginated: getPaginatedBrowseReference,
} = apiCrudService

// 🪝 HOOK STARTS HERE
// Expose CRUD hooks
export const {
    // useCreate: useCreateBrowseReference,
    useDeleteById: useDeleteBrowseReferenceById,
    useDeleteMany: useDeleteManyBrowseReferences,
    useGetAll: useGetAllBrowseReferences,
    useGetById: useGetBrowseReferenceById,
    useUpdateById: useUpdateBrowseReferenceById,
} = apiCrudHooks

export const useCreateBrowseReference = createMutationFactory<
    IBrowseReference,
    Error,
    IBrowseReferenceRequest
>({
    mutationFn: (payload) => createBrowseReference({ payload }),
    defaultInvalidates: [
        [browseReferenceBaseKey, 'paginated'],
        [browseReferenceBaseKey, 'all'],
        [memberTypeBaseQueryKey, 'all'],
    ],
})

// Custom hook for filtered and paginated member type references
export type TBrowseReferenceFetchMode = 'all' | 'specific'

export const useFilteredPaginatedBrowseReference = ({
    browseReferenceId,
    mode = 'all',
    options,
    query,
}: {
    browseReferenceId?: TEntityId
    mode?: TBrowseReferenceFetchMode
    query?: Record<string, unknown>
    options?: HookQueryOptions<IBrowseReferencePaginated, Error>
}) => {
    return useQuery<IBrowseReferencePaginated, Error>({
        ...options,
        queryKey: [
            browseReferenceBaseKey,
            'filtered-paginated',
            mode,
            browseReferenceId,
            query,
        ],
        queryFn: async () => {
            let url: string | undefined

            if (mode === 'specific' && browseReferenceId) {
                url = `member-type/${browseReferenceId}/search`
            }

            return getPaginatedBrowseReference<IBrowseReference>({
                url: url ? `${browseReferenceAPIRoute}/${url}` : undefined,
                query,
            })
        },
    })
}

export const logger = Logger.getInstance('browse-reference')
