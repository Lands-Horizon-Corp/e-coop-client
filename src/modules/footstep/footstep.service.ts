import { useQuery } from '@tanstack/react-query'

import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import type { IFootstep, IFootstepPaginated } from './footstep.types'

const { apiCrudHooks, apiCrudService } = createDataLayerFactory<
    IFootstep,
    void
>({
    url: '/api/v1/footstep',
    baseKey: 'footstep',
})

// Expose CRUD hooks
export const {
    useCreate,
    useDeleteById,
    useDeleteMany,
    useGetAll,
    useGetById,
    useGetPaginated,
    useUpdateById,
} = apiCrudHooks

// Expose API for custom queries
export const FootstepAPI = apiCrudService

// Custom hook for filtered and paginated footsteps
export type TFootstepHookMode =
    | 'me' // current auth user all footsteps
    | 'member-profile' // all footsteps of a member for current branch
    | 'me-branch' // current auth user all footsteps from all branches of current org
    | 'branch' // all footsteps from different users in current auth user's branch
    | 'user-organization' // all footsteps of a specific user

export const useFilteredPaginatedFootsteps = ({
    mode = 'me',
    userOrgId,
    memberProfileId,
    query,
    options,
}: {
    mode?: TFootstepHookMode
    userOrgId?: TEntityId
    memberProfileId?: TEntityId
    query?: Record<string, unknown>
    options?: HookQueryOptions<IFootstepPaginated, Error>
}) => {
    return useQuery<IFootstepPaginated, Error>({
        ...options,
        queryKey: [
            'footstep',
            'filtered-paginated',
            mode,
            userOrgId,
            memberProfileId,
            query,
        ],
        queryFn: async () => {
            let url: string = 'me'
            if (mode === 'me-branch') {
                url = 'current/me/branch'
            } else if (mode === 'branch') {
                url = 'branch'
            } else if (mode === 'user-organization') {
                url = `user-organization/${userOrgId}`
            } else if (mode === 'member-profile') {
                url = `member-profile/${memberProfileId}`
            }

            return FootstepAPI.getPaginated<IFootstep>({
                url: `${FootstepAPI.route}/${url}/search`,
                query,
            })
        },
    })
}
