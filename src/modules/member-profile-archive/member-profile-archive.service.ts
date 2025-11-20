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

import { TAPIQueryOptions, TEntityId } from '@/types'

import type {
    IMemberProfileArchive,
    IMemberProfileArchiveBulkRequest,
    IMemberProfileArchiveCategory,
    IMemberProfileArchiveRequest,
} from '../member-profile-archive'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: memberProfileArchiveBaseKey,
} = createDataLayerFactory<IMemberProfileArchive, IMemberProfileArchiveRequest>(
    {
        url: '/api/v1/member-profile-archive',
        baseKey: 'member-profile-archive',
    }
)

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: memberProfileArchiveAPIRoute, // matches url above

    create: createMemberProfileArchive,
    updateById: updateMemberProfileArchiveById,

    deleteById: deleteMemberProfileArchiveById,
    deleteMany: deleteManyMemberProfileArchive,

    getById: getMemberProfileArchiveById,
    getAll: getAllMemberProfileArchive,
    getPaginated: getPaginatedMemberProfileArchive,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { memberProfileArchiveBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateMemberProfileArchive,
    // useUpdateById: useUpdateMemberProfileArchiveById,

    // useGetAll: useGetAllMemberProfileArchive,
    useGetById: useGetMemberProfileArchiveById,
    useGetPaginated: useGetPaginatedMemberProfileArchive,

    // useDeleteById: useDeleteMemberProfileArchiveById,
    useDeleteMany: useDeleteManyMemberProfileArchive,
} = apiCrudHooks

export const useUpdateMemberProfileArchiveById = createMutationFactory<
    IMemberProfileArchive,
    Error,
    { id: TEntityId; payload: IMemberProfileArchiveRequest }
>({
    mutationFn: async ({ id, payload }) => {
        const response = await API.put<typeof payload, IMemberProfileArchive>(
            `${memberProfileArchiveAPIRoute}/${id}`,
            payload
        )
        return response.data
    },
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileArchiveBaseKey, 'all', 'member-profile'],
        })
        updateMutationInvalidationFn(memberProfileArchiveBaseKey, args)
    },
})

type TMemberProfileArchiveHookMode = 'all' | 'member-profile'

export const useGetAllMemberProfileArchiveByMemberProfile = ({
    mode,
    query,
    options,
    memberProfileId,
}: {
    mode?: TMemberProfileArchiveHookMode
    memberProfileId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberProfileArchive[], Error>
} = {}) => {
    return useQuery<IMemberProfileArchive[], Error>({
        ...options,
        queryKey: [
            memberProfileArchiveBaseKey,
            'all',
            mode,
            memberProfileId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url = `${memberProfileArchiveAPIRoute}`

            if (mode === 'member-profile') {
                url = `${memberProfileArchiveAPIRoute}/member-profile/${memberProfileId}`
            }

            return getAllMemberProfileArchive({
                url,
                query,
            })
        },
    })
}

export const useGetMemberProfileArchiveCategory = ({
    query,
    options,
    memberProfileId,
}: {
    memberProfileId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberProfileArchiveCategory[], Error>
} = {}) => {
    return useQuery<IMemberProfileArchiveCategory[], Error>({
        ...options,
        queryKey: [
            'member-profile-archive-category',
            'all',
            'member-profile',
            memberProfileId,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            return getAllMemberProfileArchive({
                url: `${memberProfileArchiveAPIRoute}/member-profile/${memberProfileId}/category`,
                query,
            })
        },
    })
}

// BULK Set member profile archive
export const useMemberProfileArchiveBulk = createMutationFactory<
    IMemberProfileArchive[],
    Error,
    { memberProfileId: TEntityId; payload: IMemberProfileArchiveBulkRequest }
>({
    mutationFn: async ({ payload, memberProfileId }) => {
        const url = `${memberProfileArchiveAPIRoute}/bulk/member-profile/${memberProfileId}`
        return createMemberProfileArchive({ url, payload })
    },
    defaultInvalidates: [
        ['member-profile-archive-category', 'all'],
        [memberProfileArchiveBaseKey, 'paginated'],
        [memberProfileArchiveBaseKey, 'all'],
    ],
})

export const useDeleteMemberProfileArchiveById = createMutationFactory<
    void,
    Error,
    TEntityId
>({
    mutationFn: (id) => deleteMemberProfileArchiveById({ id }),
    invalidationFn: (args) => {
        args.queryClient.invalidateQueries({
            queryKey: [memberProfileArchiveBaseKey, 'all', 'member-profile'],
        })
        args.queryClient.invalidateQueries({
            queryKey: ['member-profile-archive-category', 'all'],
        })
        deleteMutationInvalidationFn(memberProfileArchiveBaseKey, args)
    },
})

export const logger = Logger.getInstance('member-profile-archive')
// custom hooks can go here
