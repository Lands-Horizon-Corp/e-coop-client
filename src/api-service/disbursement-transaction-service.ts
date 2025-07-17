import qs from 'query-string'

import {
    IDisbursementTransaction,
    IDisbursementTransactionPaginated,
    IDisbursementTransactionRequest,
} from '@/types/coop-types/disbursement-transaction'

import { TEntityId } from '@/types'

import APIService from './api-service'

export const getDisbursementTransactionById = async (
    id: TEntityId
): Promise<IDisbursementTransaction> => {
    const response = await APIService.get<IDisbursementTransaction>(
        `/disbursement-transactions/${id}`
    )
    return response.data
}

export const createDisbursementTransaction = async (
    data: IDisbursementTransactionRequest
): Promise<IDisbursementTransaction> => {
    const response = await APIService.post<
        IDisbursementTransactionRequest,
        IDisbursementTransaction
    >('/disbursement-transactions', data)
    return response.data
}

export const updateDisbursementTransaction = async (
    id: TEntityId,
    data: IDisbursementTransactionRequest
): Promise<IDisbursementTransaction> => {
    const response = await APIService.put<
        IDisbursementTransactionRequest,
        IDisbursementTransaction
    >(`/disbursement-transactions/${id}`, data)
    return response.data
}

export const deleteDisbursementTransaction = async (
    id: TEntityId
): Promise<void> => {
    await APIService.delete<void>(`/disbursement-transactions/${id}`)
}

export const deleteManyDisbursementTransactions = async (
    ids: TEntityId[]
): Promise<void> => {
    // Assuming a bulk delete endpoint, if not needed, remove this function
    const endpoint = `/disbursement-transactions/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}

export const getAllDisbursementTransactions = async (): Promise<
    IDisbursementTransaction[]
> => {
    const response = await APIService.get<IDisbursementTransaction[]>(
        '/disbursement-transactions'
    )
    return response.data
}

export const getPaginatedDisbursementTransactions = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
} = {}): Promise<IDisbursementTransactionPaginated> => {
    const url = qs.stringifyUrl(
        {
            url: `/disbursement-transactions`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response =
        await APIService.get<IDisbursementTransactionPaginated>(url)
    return response.data
}
