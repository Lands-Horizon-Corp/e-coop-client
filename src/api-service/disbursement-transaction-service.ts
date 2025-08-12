import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import {
    IDisbursementTransaction,
    IDisbursementTransactionRequest,
    TEntityId,
} from '@/types'

const { create } = createAPICrudService<
    IDisbursementTransaction,
    IDisbursementTransactionRequest
>('/api/v1/disbursement-transaction')

const { search } = createAPICollectionService<IDisbursementTransaction>(
    '/api/v1/disbursement-transaction'
)

// GET Paginated Disbursement Transactions - Branch
export const getPaginatedBranchDisbursementTransaction = async (params: {
    sort?: string
    filter?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    return search({
        targetUrl: 'branch/search',
        sort: params.sort,
        filters: params.filter,
        pagination: params.pagination,
    })
}

// GET Paginated Disbursement Transactions - Current User
export const getPaginatedCurrentDisbursementTransaction = async (params: {
    sort?: string
    filter?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    return search({
        targetUrl: 'current/search',
        sort: params.sort,
        filters: params.filter,
        pagination: params.pagination,
    })
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
    return search({
        targetUrl: `employee/${userOrganizationId}/search`,
        sort: params.sort,
        filters: params.filter,
        pagination: params.pagination,
    })
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
    return search({
        targetUrl: `transaction-batch/${transactionBatchId}/search`,
        sort: params.sort,
        filters: params.filter,
        pagination: params.pagination,
    })
}

export default {
    create,
    search,
    getPaginatedBranchDisbursementTransaction,
    getPaginatedCurrentDisbursementTransaction,
    getPaginatedEmployeeDisbursementTransaction,
    getPaginatedTransactionBatchDisbursementTransaction,
}
