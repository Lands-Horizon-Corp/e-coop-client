import qs from 'query-string'

import { createAPICrudService } from '@/factory/api-factory-service'

import {
    IDisbursementTransaction,
    IDisbursementTransactionPaginated,
    IDisbursementTransactionRequest,
    TEntityId,
} from '@/types'

import APIService from './api-service'

const { create } = createAPICrudService<
    IDisbursementTransaction,
    IDisbursementTransactionRequest
>('/api/v1/disbursement-transaction')

// GET Paginated Disbursement Transactions - Branch
export const getPaginatedBranchDisbursementTransaction = async (params: {
    sort?: string
    filter?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: '/api/v1/disbursement-transaction/branch/search',
            query: {
                sort: params.sort,
                filter: params.filter,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response =
        await APIService.get<IDisbursementTransactionPaginated>(url)
    return response.data
}

// GET Paginated Disbursement Transactions - Current User
export const getPaginatedCurrentDisbursementTransaction = async (params: {
    sort?: string
    filter?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: '/api/v1/disbursement-transaction/current/search',
            query: {
                sort: params.sort,
                filter: params.filter,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response =
        await APIService.get<IDisbursementTransactionPaginated>(url)
    return response.data
}

// GET Paginated Disbursement Transactions - Employee
export const getPaginatedEmployeeDisbursementTransaction = async (
    userOrganizationId: TEntityId,
    params: {
        sort?: string
        filter?: string
        pagination?: { pageIndex: number; pageSize: number }
    }
) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/disbursement-transaction/employee/${userOrganizationId}/search`,
            query: {
                sort: params.sort,
                filter: params.filter,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response =
        await APIService.get<IDisbursementTransactionPaginated>(url)
    return response.data
}

// GET Paginated Disbursement Transactions - Transaction Batch
export const getPaginatedTransactionBatchDisbursementTransaction = async (
    transactionBatchId: TEntityId,
    params: {
        sort?: string
        filter?: string
        pagination?: { pageIndex: number; pageSize: number }
    }
) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/disbursement-transaction/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort: params.sort,
                filter: params.filter,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response =
        await APIService.get<IDisbursementTransactionPaginated>(url)
    return response.data
}

export default {
    create,
    getPaginatedBranchDisbursementTransaction,
    getPaginatedCurrentDisbursementTransaction,
    getPaginatedEmployeeDisbursementTransaction,
    getPaginatedTransactionBatchDisbursementTransaction,
}
