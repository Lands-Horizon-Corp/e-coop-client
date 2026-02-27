import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import type {
    IFinancialStatementTitle,
    IFinancialStatementTitleRequest,
} from '../financial-statement-title'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: financialStatementTitleBaseKey,
} = createDataLayerFactory<
    IFinancialStatementTitle,
    IFinancialStatementTitleRequest
>({
    url: '/api/v1/financial-statement-title',
    baseKey: 'financial-statement-title',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: financialStatementTitleAPIRoute, // matches url above

    create: createFinancialStatementTitle,
    updateById: updateFinancialStatementTitleById,

    deleteById: deleteFinancialStatementTitleById,
    deleteMany: deleteManyFinancialStatementTitle,

    getById: getFinancialStatementTitleById,
    getAll: getAllFinancialStatementTitle,
    getPaginated: getPaginatedFinancialStatementTitle,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { financialStatementTitleBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateFinancialStatementTitle,
    useUpdateById: useUpdateFinancialStatementTitleById,

    useGetAll: useGetAllFinancialStatementTitle,
    useGetById: useGetFinancialStatementTitleById,
    useGetPaginated: useGetPaginatedFinancialStatementTitle,

    useDeleteById: useDeleteFinancialStatementTitleById,
    useDeleteMany: useDeleteManyFinancialStatementTitle,
} = apiCrudHooks

type ids = string[]

export const useFinancialStatementTitleOrder = createMutationFactory<
    void,
    void,
    ids
>({
    mutationFn: async (ids) => {
        return (
            await API.put<ids, void>(
                `${financialStatementTitleAPIRoute}/order`,
                ids
            )
        ).data
    },
})

export const logger = Logger.getInstance('financial-statement-title')
// custom hooks can go here
