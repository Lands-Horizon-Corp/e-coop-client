import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IOtherFundEntry,
    IOtherFundEntryRequest,
} from '../other-fund-entry'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: otherFundEntryBaseKey,
} = createDataLayerFactory<IOtherFundEntry, IOtherFundEntryRequest>({
    url: '/api/v1/other-fund-entry',
    baseKey: 'other-fund-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: otherFundEntryAPIRoute, // matches url above

    create: createOtherFundEntry,
    updateById: updateOtherFundEntryById,

    deleteById: deleteOtherFundEntryById,
    deleteMany: deleteManyOtherFundEntry,

    getById: getOtherFundEntryById,
    getAll: getAllOtherFundEntry,
    getPaginated: getPaginatedOtherFundEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { otherFundEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateOtherFundEntry,
    useUpdateById: useUpdateOtherFundEntryById,

    useGetAll: useGetAllOtherFundEntry,
    useGetById: useGetOtherFundEntryById,
    useGetPaginated: useGetPaginatedOtherFundEntry,

    useDeleteById: useDeleteOtherFundEntryById,
    useDeleteMany: useDeleteManyOtherFundEntry,
} = apiCrudHooks

export const logger = Logger.getInstance('other-fund-entry')
// custom hooks can go here
