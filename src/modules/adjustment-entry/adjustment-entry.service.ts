import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IAdjustmentEntry,
    IAdjustmentEntryRequest,
} from '../adjustment-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: adjustmentEntryBaseKey,
} = createDataLayerFactory<IAdjustmentEntry, IAdjustmentEntryRequest>({
    url: '/api/v1/adjustment-entry',
    baseKey: 'adjustment-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: adjustmentEntryAPIRoute, // matches url above

    create: createAdjustmentEntry,
    updateById: updateAdjustmentEntryById,

    deleteById: deleteAdjustmentEntryById,
    deleteMany: deleteManyAdjustmentEntry,

    getById: getAdjustmentEntryById,
    getAll: getAllAdjustmentEntry,
    getPaginated: getPaginatedAdjustmentEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { adjustmentEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateAdjustmentEntry,
    useUpdateById: useUpdateAdjustmentEntryById,

    useGetAll: useGetAllAdjustmentEntry,
    useGetById: useGetAdjustmentEntryById,
    useGetPaginated: useGetPaginatedAdjustmentEntry,

    useDeleteById: useDeleteAdjustmentEntryById,
    useDeleteMany: useDeleteManyAdjustmentEntry,
} = apiCrudHooks

// custom hooks can go here
