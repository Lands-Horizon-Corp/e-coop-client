import { Logger } from '@/helpers/loggers'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'
import {
    createMutationFactory,
    updateMutationInvalidationFn,
} from '@/providers/repositories/mutation-factory'

import { TEntityId } from '@/types'

import type {
    IComputationSheet,
    IComputationSheetAmortizationResponse,
    IComputationSheetAmortizationResponseRequest,
    IComputationSheetRequest,
} from '../computation-sheet'

const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: computationSheetBaseKey,
} = createDataLayerFactory<IComputationSheet, IComputationSheetRequest>({
    url: '/api/v1/computation-sheet',
    baseKey: 'computation-sheet',
})

// ⚙️🛠️ API SERVICE HERE
export const {
    API, // rarely used, for raw calls
    route: computationSheetAPIRoute, // matches url above

    create: createComputationSheet,
    updateById: updateComputationSheetById,

    deleteById: deleteComputationSheetById,
    deleteMany: deleteManyComputationSheet,

    getById: getComputationSheetById,
    getAll: getAllComputationSheet,
    getPaginated: getPaginatedComputationSheet,
} = apiCrudService

// custom service functions can go here

// 🪝 HOOK STARTS HERE
export { computationSheetBaseKey } // Exported in case it's needed outside

export const {
    useCreate: useCreateComputationSheet,
    // useUpdateById: useUpdateComputationSheetById,

    useGetAll: useGetAllComputationSheet,
    useGetById: useGetComputationSheetById,
    useGetPaginated: useGetPaginatedComputationSheet,

    useDeleteById: useDeleteComputationSheetById,
    useDeleteMany: useDeleteManyComputationSheet,
} = apiCrudHooks

// custom hooks can go here

export const useUpdateComputationSheetById = createMutationFactory<
    IComputationSheet,
    Error,
    { id: TEntityId; payload: IComputationSheetRequest }
>({
    mutationFn: (variables) => updateComputationSheetById(variables),
    defaultInvalidates: [[computationSheetBaseKey, 'all']],
    invalidationFn: (args) => {
        updateMutationInvalidationFn(computationSheetBaseKey, args)
    },
})

// Use for scheme calculator
export const useCalculateSchemeAmortization = createMutationFactory<
    IComputationSheetAmortizationResponse,
    Error,
    { id: TEntityId; data: IComputationSheetAmortizationResponseRequest }
>({
    mutationFn: async ({ id, data }) => {
        const response = await API.post<
            IComputationSheetAmortizationResponseRequest,
            IComputationSheetAmortizationResponse
        >(`${computationSheetAPIRoute}/${id}/calculator`, data)
        return response.data
    },
})

export const logger = Logger.getInstance('computation-sheet')
