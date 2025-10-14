import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

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

// custom hooks can go here
export const logger = Logger.getInstance('collectors-member-account-entry')
