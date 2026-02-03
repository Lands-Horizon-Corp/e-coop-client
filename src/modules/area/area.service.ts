import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type { IArea, IAreaRequest } from '../area'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: areaBaseKey,
} = createDataLayerFactory<IArea, IAreaRequest>({
    url: '/api/v1/area',
    baseKey: 'area',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: areaAPIRoute, // matches url above

    create: createArea,
    updateById: updateAreaById,

    deleteById: deleteAreaById,
    deleteMany: deleteManyArea,

    getById: getAreaById,
    getAll: getAllArea,
    getPaginated: getPaginatedArea,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { areaBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateArea,
    useUpdateById: useUpdateAreaById,

    useGetAll: useGetAllArea,
    useGetById: useGetAreaById,
    useGetPaginated: useGetPaginatedArea,

    useDeleteById: useDeleteAreaById,
    useDeleteMany: useDeleteManyArea,
} = apiCrudHooks

export const logger = Logger.getInstance('area')
// custom hooks can go here
