import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
    createAPIExportableService,
} from '@/factory/api-factory-service'

import { ICheckEntry, ICheckEntryPaginated, TEntityId } from '@/types'

import APIService from './api-service'

const CrudService = createAPICrudService<ICheckEntry, void>(
    '/api/v1/check-entry'
)

const CollectionService = createAPICollectionService<ICheckEntry>(
    '/api/v1/check-entry'
)

const ExportService = createAPIExportableService('/api/v1/check-entry', {
    base: '/api/v1/check-entry',
})

export const getPaginatedBatchCheckEntry = async ({
    sort,
    filters,
    pagination,
    transactionBatchId,
}: {
    transactionBatchId: TEntityId
} & {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/check-entry/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ICheckEntryPaginated>(url)
    return response.data
}

export const { allList, search } = CollectionService
export const { getById, deleteById, deleteMany } = CrudService
export const { exportAll, exportFiltered, exportSelected } = ExportService

export default {
    getById,
    deleteById,
    deleteMany,
    getPaginatedBatchCheckEntry,
    ...CollectionService,
    ...ExportService,
}
