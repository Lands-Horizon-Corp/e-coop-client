import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import type {
    IGeneratedSavingsInterest,
    IGeneratedSavingsInterestRequest,
} from '../generated-savings-interest'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generatedSavingsInterestBaseKey,
} = createDataLayerFactory<
    IGeneratedSavingsInterest,
    IGeneratedSavingsInterestRequest
>({
    url: '/api/v1/generated-savings-interest',
    baseKey: 'generated-savings-interest',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: generatedSavingsInterestAPIRoute, // matches url above

    create: createGeneratedSavingsInterest,
    updateById: updateGeneratedSavingsInterestById,

    deleteById: deleteGeneratedSavingsInterestById,
    deleteMany: deleteManyGeneratedSavingsInterest,

    getById: getGeneratedSavingsInterestById,
    getAll: getAllGeneratedSavingsInterest,
    getPaginated: getPaginatedGeneratedSavingsInterest,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { generatedSavingsInterestBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateGeneratedSavingsInterest,
    useUpdateById: useUpdateGeneratedSavingsInterestById,

    useGetAll: useGetAllGeneratedSavingsInterest,
    useGetById: useGetGeneratedSavingsInterestById,
    useGetPaginated: useGetPaginatedGeneratedSavingsInterest,

    useDeleteById: useDeleteGeneratedSavingsInterestById,
    useDeleteMany: useDeleteManyGeneratedSavingsInterest,
} = apiCrudHooks

// Process button in old Coop
// this process, but does not yet save the generated entry
export const useGenerateSavingsInterestProcessView = createMutationFactory<
    IGeneratedSavingsInterest,
    Error,
    IGeneratedSavingsInterestRequest
>({
    mutationFn: async (payload) => {
        const response = await API.post<
            typeof payload,
            IGeneratedSavingsInterest
        >(`${generatedSavingsInterestAPIRoute}/view`, payload)

        return response.data
    },
    defaultInvalidates: [[generatedSavingsInterestBaseKey, 'all', 'view']],
})

export const logger = Logger.getInstance('generated-savings-interest')
// custom hooks can go here
