import qs from 'query-string'

import {
    createAPICrudService,
    createAPICollectionService,
    createAPIExportableService,
} from '@/factory/api-factory-service'
import APIService from './api-service'

import { IOnlineEntry, IOnlineEntryPaginated, TEntityId } from '@/types'

const CrudService = createAPICrudService<IOnlineEntry, void>('/online-entry')

const CollectionService =
    createAPICollectionService<IOnlineEntry>('/online-entry')

const ExportService = createAPIExportableService('/online-entry', {
    base: 'online_entry',
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
            url: `/online-entry/transaction-batch/${transactionBatchId}/search`,
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
