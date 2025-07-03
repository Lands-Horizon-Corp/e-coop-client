import { IMemberAccountingLedger, TEntityId } from '@/types'
import {
    ITransaction,
    ITransactionPaginated,
} from '@/types/coop-types/transaction'

import APIService from './api-service'

import qs from 'query-string'

export const getTransactionById = async (
    id: TEntityId
): Promise<ITransaction> => {
    const response = await APIService.get<ITransaction>(`/transaction/${id}`)
    return response.data
}

export const deleteTransaction = async (id: TEntityId): Promise<void> => {
    await APIService.delete<void>(`/transaction/${id}`)
}

export const deleteManyTransactions = async (
    ids: TEntityId[]
): Promise<void> => {
    const endpoint = `/transaction/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const getAllTransactions = async (): Promise<ITransaction[]> => {
    const response = await APIService.get<ITransaction[]>('/transaction')
    return response.data
}

export const getPaginatedTransactions = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}): Promise<ITransactionPaginated> => {
    const url = qs.stringifyUrl(
        {
            url: `/transaction`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<ITransactionPaginated>(url)
    return response.data
}

export const getMemberAccountingLedger = async (memberProfileId: TEntityId) => {
    const url = qs.stringifyUrl({
        url: `transaction/member-profile/${memberProfileId}`,
    })

    const response = await APIService.get<IMemberAccountingLedger>(url)
    return response.data
}
