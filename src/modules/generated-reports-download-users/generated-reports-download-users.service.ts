import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IGeneratedReportsDownloadUsers,
    IGeneratedReportsDownloadUsersRequest,
} from '../generated-reports-download-users'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generatedReportsDownloadUsersBaseKey,
} = createDataLayerFactory<
    IGeneratedReportsDownloadUsers,
    IGeneratedReportsDownloadUsersRequest
>({
    url: '/api/v1/generated-reports-download-users',
    baseKey: 'generated-reports-download-users',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: generatedReportsDownloadUsersAPIRoute, // matches url above

    create: createGeneratedReportsDownloadUsers,
    updateById: updateGeneratedReportsDownloadUsersById,

    deleteById: deleteGeneratedReportsDownloadUsersById,
    deleteMany: deleteManyGeneratedReportsDownloadUsers,

    getById: getGeneratedReportsDownloadUsersById,
    getAll: getAllGeneratedReportsDownloadUsers,
    getPaginated: getPaginatedGeneratedReportsDownloadUsers,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { generatedReportsDownloadUsersBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateGeneratedReportsDownloadUsers,
    useUpdateById: useUpdateGeneratedReportsDownloadUsersById,

    useGetAll: useGetAllGeneratedReportsDownloadUsers,
    useGetById: useGetGeneratedReportsDownloadUsersById,
    useGetPaginated: useGetPaginatedGeneratedReportsDownloadUsers,

    useDeleteById: useDeleteGeneratedReportsDownloadUsersById,
    useDeleteMany: useDeleteManyGeneratedReportsDownloadUsers,
} = apiCrudHooks

export const logger = Logger.getInstance('generated-reports-download-users')
// custom hooks can go here
