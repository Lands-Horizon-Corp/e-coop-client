import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IUnbalanceAccount,
    IUnbalanceAccountRequest,
} from '../unbalance-account'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: unbalanceAccountBaseKey,
} = createDataLayerFactory<IUnbalanceAccount, IUnbalanceAccountRequest>({
    url: '/api/v1/unbalance-account',
    baseKey: 'unbalance-account',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: unbalanceAccountAPIRoute, // matches url above

    create: createUnbalanceAccount,
    updateById: updateUnbalanceAccountById,

    deleteById: deleteUnbalanceAccountById,
    deleteMany: deleteManyUnbalanceAccount,

    getById: getUnbalanceAccountById,
    getAll: getAllUnbalanceAccount,
    getPaginated: getPaginatedUnbalanceAccount,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { unbalanceAccountBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateUnbalanceAccount,
    useUpdateById: useUpdateUnbalanceAccountById,

    useGetAll: useGetAllUnbalanceAccount,
    useGetById: useGetUnbalanceAccountById,
    useGetPaginated: useGetPaginatedUnbalanceAccount,

    useDeleteById: useDeleteUnbalanceAccountById,
    useDeleteMany: useDeleteManyUnbalanceAccount,
} = apiCrudHooks

export const logger = Logger.getInstance('unbalance-account')
// custom hooks can go here
