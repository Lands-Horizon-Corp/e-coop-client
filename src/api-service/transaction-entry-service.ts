import qs from 'query-string'

import APIService from './api-service'

import {
    TEntityId,
    ITransactionEntryPaginated,
    ITransactionEntry,
    ITransactionEntryRequest,
} from '@/types'

export const getPaginatedBatchTransactionEntry = async ({
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
            url: `/transaction-entry/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort,
                filter: filters,
                pageSize: pagination?.pageSize,
                pageIndex: pagination?.pageIndex,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ITransactionEntryPaginated>(url)
    return response.data
}

export const getTransactionEntryById = async (
    id: TEntityId
): Promise<ITransactionEntry> => {
    const response = await APIService.get<ITransactionEntry>(
        `/transaction-entries/${id}`
    )
    return response.data
}

export const createTransactionEntry = async (
    data: ITransactionEntryRequest
) => {
    const response = await APIService.post<
        ITransactionEntryRequest,
        ITransactionEntry
    >('/transaction-entries', data)
    return response.data
}

export const updateTransactionEntry = async (
    id: TEntityId,
    data: ITransactionEntry
): Promise<ITransactionEntry> => {
    const response = await APIService.put<ITransactionEntry, ITransactionEntry>(
        `/transaction-entries/${id}`,
        data
    )
    return response.data
}

export const deleteTransactionEntry = async (id: TEntityId): Promise<void> => {
    await APIService.delete<void>(`/transaction-entries/${id}`)
}

export const deleteManyTransactionEntries = async (
    ids: TEntityId[]
): Promise<void> => {
    // Assuming a bulk delete endpoint, if not needed, remove this function
    const endpoint = `/transaction-entries/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const getAllTransactionEntries = async (): Promise<
    ITransactionEntry[]
> => {
    const response = await APIService.get<ITransactionEntry[]>(
        '/transaction-entries'
    )
    return response.data
}

export const getPaginatedTransactionEntries = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}): Promise<ITransactionEntryPaginated> => {
    const url = qs.stringifyUrl(
        {
            url: `/transaction-entries`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<ITransactionEntryPaginated>(url)
    return response.data
}
