import { useQuery } from '@tanstack/react-query'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

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

type AdjustmentEntryTotal = {
    total_debit: number
    total_credit: number
}

export const useAdjustmentEntryTotal = ({
    options,
}: {
    options?: HookQueryOptions<AdjustmentEntryTotal, Error>
}) => {
    return useQuery<AdjustmentEntryTotal, Error>({
        ...options,
        queryKey: ['adjustment-entry', 'total'],
        queryFn: async (): Promise<AdjustmentEntryTotal> => {
            const res = await API.get('/api/v1/adjustment-entry/total')
            return res.data as AdjustmentEntryTotal
        },
    })
}

export const logger = Logger.getInstance('adjustment-entry')
