import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import type {
    IChargesRateScheme,
    IChargesRateSchemeRequest,
} from '../charges-rate-scheme'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: chargesRateSchemeBaseKey,
} = createDataLayerFactory<IChargesRateScheme, IChargesRateSchemeRequest>({
    url: '/api/v1/charges-rate-scheme',
    baseKey: 'charges-rate-scheme',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: chargesRateSchemeAPIRoute, // matches url above

    create: createChargesRateScheme,
    updateById: updateChargesRateSchemeById,

    deleteById: deleteChargesRateSchemeById,
    deleteMany: deleteManyChargesRateScheme,

    getById: getChargesRateSchemeById,
    getAll: getAllChargesRateScheme,
    getPaginated: getPaginatedChargesRateScheme,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { chargesRateSchemeBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateChargesRateScheme,
    useUpdateById: useUpdateChargesRateSchemeById,

    useGetAll: useGetAllChargesRateScheme,
    useGetById: useGetChargesRateSchemeById,
    useGetPaginated: useGetPaginatedChargesRateScheme,

    useDeleteById: useDeleteChargesRateSchemeById,
    useDeleteMany: useDeleteManyChargesRateScheme,
} = apiCrudHooks

export const logger = Logger.getInstance('charges-rate-scheme')
// custom hooks can go here
