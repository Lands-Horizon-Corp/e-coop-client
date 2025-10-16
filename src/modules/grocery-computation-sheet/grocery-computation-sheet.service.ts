import { Logger } from '@/helpers/loggers'
import type {
    IGroceryComputationSheet,
    IGroceryComputationSheetRequest,
} from '@/modules/grocery-computation-sheet'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: groceryComputationSheetBaseKey,
} = createDataLayerFactory<
    IGroceryComputationSheet,
    IGroceryComputationSheetRequest
>({
    url: '/api/v1/grocery-computation-sheet',
    baseKey: 'grocery-computation-sheet',
})

export const {
    API,
    route: groceryComputationSheetAPIRoute,

    create: createGroceryComputationSheet,
    updateById: updateGroceryComputationSheetById,

    deleteById: deleteGroceryComputationSheetById,
    deleteMany: deleteManyGroceryComputationSheet,

    getById: getGroceryComputationSheetById,
    getAll: getAllGroceryComputationSheet,
    getPaginated: getPaginatedGroceryComputationSheet,
} = apiCrudService

export { groceryComputationSheetBaseKey }

export const {
    useCreate: useCreateGroceryComputationSheet,
    useUpdateById: useUpdateGroceryComputationSheetById,

    useGetAll: useGetAllGroceryComputationSheet,
    useGetById: useGetGroceryComputationSheetById,
    useGetPaginated: useGetPaginatedGroceryComputationSheet,

    useDeleteById: useDeleteGroceryComputationSheetById,
    useDeleteMany: useDeleteManyGroceryComputationSheet,
} = apiCrudHooks

export const logger = Logger.getInstance('grocery-computation-sheet')
