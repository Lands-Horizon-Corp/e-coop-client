import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IDashboard, IDashboardRequest } from '../dashboard'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: dashboardBaseKey,
} = createDataLayerFactory<IDashboard, IDashboardRequest>({
    url: '/api/v1/dashboard',
    baseKey: 'dashboard',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: dashboardAPIRoute, // matches url above

    create: createDashboard,
    updateById: updateDashboardById,

    deleteById: deleteDashboardById,
    deleteMany: deleteManyDashboard,

    getById: getDashboardById,
    getAll: getAllDashboard,
    getPaginated: getPaginatedDashboard,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { dashboardBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateDashboard,
    useUpdateById: useUpdateDashboardById,

    useGetAll: useGetAllDashboard,
    useGetById: useGetDashboardById,
    useGetPaginated: useGetPaginatedDashboard,

    useDeleteById: useDeleteDashboardById,
    useDeleteMany: useDeleteManyDashboard,
} = apiCrudHooks

export const logger = Logger.getInstance('dashboard')
// custom hooks can go here
