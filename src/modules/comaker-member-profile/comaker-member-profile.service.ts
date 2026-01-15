import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import type { IComakerMemberProfile, IComakerMemberProfileRequest } from '.'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: comakerMemberProfileBaseKey,
} = createDataLayerFactory<IComakerMemberProfile, IComakerMemberProfileRequest>(
    {
        url: '/api/v1/comaker-member-profile',
        baseKey: 'comaker-member-profile',
    }
)

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: comakerMemberProfileAPIRoute, // matches url above

    create: createComakerMemberProfile,
    updateById: updateComakerMemberProfileById,

    deleteById: deleteComakerMemberProfileById,
    deleteMany: deleteManyComakerMemberProfile,

    getById: getComakerMemberProfileById,
    getAll: getAllComakerMemberProfile,
    getPaginated: getPaginatedComakerMemberProfile,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { comakerMemberProfileBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateComakerMemberProfile,
    useUpdateById: useUpdateComakerMemberProfileById,

    useGetAll: useGetAllComakerMemberProfile,
    useGetById: useGetComakerMemberProfileById,
    useGetPaginated: useGetPaginatedComakerMemberProfile,

    useDeleteById: useDeleteComakerMemberProfileById,
    useDeleteMany: useDeleteManyComakerMemberProfile,
} = apiCrudHooks

// /api/v1/member-profile-comaker/member-profile/:member_profile_id
export const useMemberProfileComakers = ({
    id,
    options,
}: {
    id: TEntityId
    options?: HookQueryOptions<IComakerMemberProfile[], Error>
}) => {
    return useQuery<IComakerMemberProfile[], Error>({
        ...options,
        queryKey: [comakerMemberProfileBaseKey, id],
        queryFn: async () =>
            await getAllComakerMemberProfile<IComakerMemberProfile>({
                url: `/api/v1/member-profile-comaker/member-profile/${id}`,
            }),
    })
}

// custom hooks can go here
export const logger = Logger.getInstance('collectors-member-account-entry')
