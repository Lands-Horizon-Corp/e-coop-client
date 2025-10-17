import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IOrganizationMedia,
    IOrganizationMediaRequest,
} from '../organization-media'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: organizationMediaBaseKey,
} = createDataLayerFactory<IOrganizationMedia, IOrganizationMediaRequest>({
    url: '/api/v1/organization-media',
    baseKey: 'organization-media',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: organizationMediaAPIRoute, // matches url above

    create: createOrganizationMedia,
    updateById: updateOrganizationMediaById,

    deleteById: deleteOrganizationMediaById,
    deleteMany: deleteManyOrganizationMedia,

    getById: getOrganizationMediaById,
    getAll: getAllOrganizationMedia,
    getPaginated: getPaginatedOrganizationMedia,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { organizationMediaBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateOrganizationMedia,
    useUpdateById: useUpdateOrganizationMediaById,

    useGetAll: useGetAllOrganizationMedia,
    useGetById: useGetOrganizationMediaById,
    useGetPaginated: useGetPaginatedOrganizationMedia,

    useDeleteById: useDeleteOrganizationMediaById,
    useDeleteMany: useDeleteManyOrganizationMedia,
} = apiCrudHooks

export const logger = Logger.getInstance('organization-media')
// custom hooks can go here
