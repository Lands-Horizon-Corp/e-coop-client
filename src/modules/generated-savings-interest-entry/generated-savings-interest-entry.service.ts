import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'


import { Logger } from '@/helpers/loggers'

import type { IGeneratedSavingsInterestEntry, IGeneratedSavingsInterestEntryRequest } from '../generated-savings-interest-entry'

const { apiCrudHooks, apiCrudService, baseQueryKey : generatedSavingsInterestEntryBaseKey } = createDataLayerFactory<
    IGeneratedSavingsInterestEntry,
    IGeneratedSavingsInterestEntryRequest
>({
    url: '/api/v1/generated-savings-interest-entry',
    baseKey: 'generated-savings-interest-entry',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: generatedSavingsInterestEntryAPIRoute, // matches url above

    create: createGeneratedSavingsInterestEntry,
    updateById: updateGeneratedSavingsInterestEntryById,

    deleteById: deleteGeneratedSavingsInterestEntryById,
    deleteMany: deleteManyGeneratedSavingsInterestEntry,

    getById: getGeneratedSavingsInterestEntryById,
    getAll: getAllGeneratedSavingsInterestEntry,
    getPaginated: getPaginatedGeneratedSavingsInterestEntry,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { generatedSavingsInterestEntryBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateGeneratedSavingsInterestEntry,
    useUpdateById: useUpdateGeneratedSavingsInterestEntryById,

    useGetAll: useGetAllGeneratedSavingsInterestEntry,
    useGetById: useGetGeneratedSavingsInterestEntryById,
    useGetPaginated: useGetPaginatedGeneratedSavingsInterestEntry,

    useDeleteById: useDeleteGeneratedSavingsInterestEntryById,
    useDeleteMany: useDeleteManyGeneratedSavingsInterestEntry,
} = apiCrudHooks

export const logger = Logger.getInstance('generated-savings-interest-entry')
// custom hooks can go here
