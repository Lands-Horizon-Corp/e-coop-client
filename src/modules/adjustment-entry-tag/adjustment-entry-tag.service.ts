import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IAdjustmentEntryTag,
    IAdjustmentEntryTagRequest,
} from '../adjustment-entry-tag'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: adjustmentEntryTagBaseKey,
} = createDataLayerFactory<IAdjustmentEntryTag, IAdjustmentEntryTagRequest>({
    url: '/api/v1/adjustment-entry-tag',
    baseKey: 'adjustment-entry-tag',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: adjustmentEntryTagAPIRoute, // matches url above

    create: createAdjustmentEntryTag,
    updateById: updateAdjustmentEntryTagById,

    deleteById: deleteAdjustmentEntryTagById,
    deleteMany: deleteManyAdjustmentEntryTag,

    getById: getAdjustmentEntryTagById,
    getAll: getAllAdjustmentEntryTag,
    getPaginated: getPaginatedAdjustmentEntryTag,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { adjustmentEntryTagBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateAdjustmentEntryTag,
    useUpdateById: useUpdateAdjustmentEntryTagById,

    useGetAll: useGetAllAdjustmentEntryTag,
    useGetById: useGetAdjustmentEntryTagById,
    useGetPaginated: useGetPaginatedAdjustmentEntryTag,

    useDeleteById: useDeleteAdjustmentEntryTagById,
    useDeleteMany: useDeleteManyAdjustmentEntryTag,
} = apiCrudHooks

export const logger = Logger.getInstance('adjustment-entry-tag')
