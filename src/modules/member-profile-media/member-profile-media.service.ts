import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    deleteMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberProfileMedia,
    IMemberProfileMediaBulkRequest,
    IMemberProfileMediaRequest,
} from '../member-profile-media'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: memberProfileMediaBaseKey,
} = createDataLayerFactory<IMemberProfileMedia, IMemberProfileMediaRequest>({
    url: '/api/v1/member-profile-media',
    baseKey: 'member-profile-media',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: memberProfileMediaAPIRoute, // matches url above

    create: createMemberProfileMedia,
    updateById: updateMemberProfileMediaById,

    deleteById: deleteMemberProfileMediaById,
    deleteMany: deleteManyMemberProfileMedia,

    getById: getMemberProfileMediaById,
    getAll: getAllMemberProfileMedia,
    getPaginated: getPaginatedMemberProfileMedia,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { memberProfileMediaBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateMemberProfileMedia,
    useUpdateById: useUpdateMemberProfileMediaById,

    // useGetAll: useGetAllMemberProfileMedia,
    useGetById: useGetMemberProfileMediaById,
    useGetPaginated: useGetPaginatedMemberProfileMedia,

    // useDeleteById: useDeleteMemberProfileMediaById,
    useDeleteMany: useDeleteManyMemberProfileMedia,
} = apiCrudHooks

type TMemberProfileMediaHookMode = 'all' | 'member-profile'

export const useGetAllMemberProfileMediaByMemberProfile = ({
    mode,
    query,
    options,
    memberProfileId,
}: {
    mode?: TMemberProfileMediaHookMode
    memberProfileId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberProfileMedia[], Error>
} = {}) => {
    return useQuery<IMemberProfileMedia[], Error>({
        ...options,
        queryKey: [memberProfileMediaBaseKey, 'all', mode, query].filter(
            Boolean
        ),
        queryFn: async () => {
            let url = `${memberProfileMediaAPIRoute}`

            if (mode === 'member-profile') {
                url = `${memberProfileMediaAPIRoute}/member-profile/${memberProfileId}`
            }

            return getAllMemberProfileMedia({
                url,
                query,
            })
        },
    })
}

// BULK Set member profile media
export const useMemberProfileMediaBulk = createMutationFactory<
    IMemberProfileMedia[],
    Error,
    { memberProfileId: TEntityId } & IMemberProfileMediaBulkRequest
>({
    mutationFn: async (payload) => {
        const url = `${memberProfileMediaAPIRoute}/bulk/member-profile/${payload.memberProfileId}`
        return createMemberProfileMedia({ url, payload })
    },
    defaultInvalidates: [
        [memberProfileMediaBaseKey, 'paginated'],
        [memberProfileMediaBaseKey, 'all'],
    ],
})

export const useDeleteMemberProfileMediaById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteMemberProfileMediaById({ id }),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileMediaBaseKey, 'all', 'member-profile'],
        })
        deleteMutationInvalidationFn(memberProfileMediaBaseKey, args)
    },
})

export const logger = Logger.getInstance('member-profile-media')
// custom hooks can go here
