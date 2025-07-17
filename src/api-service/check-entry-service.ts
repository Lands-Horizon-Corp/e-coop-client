import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
    createAPIExportableService,
} from '@/factory/api-factory-service'

import { ICheckEntry, ICheckEntryPaginated, TEntityId } from '@/types'

import APIService from './api-service'

const CrudService = createAPICrudService<ICheckEntry, void>('/check-entry')

const CollectionService =
    createAPICollectionService<ICheckEntry>('/check-entry')

const ExportService = createAPIExportableService('/check-entry', {
    base: 'online_entry',
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
            url: `/check-entry/transaction-batch/${transactionBatchId}/search`,
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
