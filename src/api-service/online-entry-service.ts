import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
    createAPIExportableService,
} from '@/factory/api-factory-service'

import { IOnlineEntry, IOnlineEntryPaginated, TEntityId } from '@/types'

import APIService from './api-service'

const CrudService = createAPICrudService<IOnlineEntry, void>('/api/v1/online-entry')

const CollectionService =
    createAPICollectionService<IOnlineEntry>('/api/v1/online-entry')

const ExportService = createAPIExportableService('/api/v1/online-entry', {
    base: '/api/v1/online_entry',
})

export const getPaginatedBatchOnlineEntry = async ({
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
            url: `/api/v1/online-entry/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IOnlineEntryPaginated>(url)
    return response.data
}

export const { getById, deleteById, deleteMany } = CrudService

export const { exportAll, exportFiltered, exportSelected } = ExportService

export default {
    getById,
    deleteById,
    deleteMany,
    getPaginatedBatchOnlineEntry,
    ...CollectionService,
    ...ExportService,
}
