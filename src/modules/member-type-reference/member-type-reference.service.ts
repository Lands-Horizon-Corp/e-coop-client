import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import type {
    IMemberTypeReference,
    IMemberTypeReferencePaginated,
    IMemberTypeReferenceRequest,
} from './member-type-reference.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IMemberTypeReference,
    IMemberTypeReferenceRequest
>({
    url: '/api/v1/member-type-reference',
    baseKey: 'member-type-reference',
})

// ⚙️🛠️ API SERVICE HERE
// Expose API for custom queries
export const MemberTypeReferenceAPI = apiCrudService

// 🪝 HOOK STARTS HERE
// Expose CRUD hooks
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useUpdateById,
} = apiCrudHooks

// Custom hook for filtered and paginated member type references
export type TMemberTypeReferenceFetchMode = 'all' | 'specific'

export const useFilteredPaginatedMemberTypeReference = ({
    memberTypeId,
    mode = 'all',
    options,
    query,
}: {
    memberTypeId?: TEntityId
    mode?: TMemberTypeReferenceFetchMode
    query?: Record<string, unknown>
    options?: HookQueryOptions<IMemberTypeReferencePaginated, Error>
}) => {
    return useQuery<IMemberTypeReferencePaginated, Error>({
        ...options,
        queryKey: [
            'member-type-reference',
            'filtered-paginated',
            mode,
            memberTypeId,
            query,
        ],
        queryFn: async () => {
            let url: string | undefined

            if (mode === 'specific' && memberTypeId) {
                url = `member-type/${memberTypeId}/search`
            }

            return MemberTypeReferenceAPI.getPaginated<IMemberTypeReference>({
                url: url ? `${MemberTypeReferenceAPI.route}/${url}` : undefined,
                query,
            })
        },
    })
}

export const logger = Logger.getInstance('member-type-reference')
