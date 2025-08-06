import qs from 'query-string'

import {
    IGeneralLedger,
    IGeneralLedgerPaginated,
    IMemberAccountingLedgerTotal,
    IMemberGeneralLedgerTotal,
    TEntityId,
    TEntryType,
} from '@/types'

import APIService from '../api-service'

export const getGeneralLedgerByID = async (id: TEntityId) => {
    const response = await APIService.get<IGeneralLedger>(
        `/api/v1/general-ledger/${id}`
    )
    return response.data
}

// 1. BRANCH
export const getPaginatedBranchGeneralLedger = async (
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/branch/${TEntryType}/search`
                : `/api/v1/general-ledger/branch/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 2. ME (CURRENT)
export const getPaginatedCurrentGeneralLedger = async (
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/current/${TEntryType}/search`
                : `/api/v1/general-ledger/current/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 3. EMPLOYEE
export const getPaginatedEmployeeGeneralLedger = async (
    userOrganizationId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/employee/${userOrganizationId}/${TEntryType}/search`
                : `/api/v1/general-ledger/employee/${userOrganizationId}/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 4. MEMBER
export const getPaginatedMemberGeneralLedger = async (
    memberProfileId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/member-profile/${memberProfileId}/${TEntryType}/search`
                : `/api/v1/general-ledger/member-profile/${memberProfileId}/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 5. MEMBER ACCOUNT
export const getPaginatedMemberAccountGeneralLedger = async ({
    EntryType,
    accountId,
    memberProfileId,
    params,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
    params: {
        sort?: string
        filter?: string
        pagination?: { pageIndex: number; pageSize: number }
    }
    EntryType: TEntryType
}) => {
    const url = qs.stringifyUrl(
        {
            url: EntryType
                ? `/api/v1/general-ledger/member-profile/${memberProfileId}/account/${accountId}/${EntryType}/search`
                : `/api/v1/general-ledger/member-profile/${memberProfileId}/account/${accountId}/search`,
            query: {
                sort: params.sort,
                filter: params.filter,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 6. TRANSACTION BATCH
export const getPaginatedTransactionBatchGeneralLedger = async (
    transactionBatchId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/transaction-batch/${transactionBatchId}/${TEntryType}/search`
                : `/api/v1/general-ledger/transaction-batch/${transactionBatchId}/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 7. TRANSACTION
export const getPaginatedTransactionGeneralLedger = async (
    transactionId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/transaction/${transactionId}/${TEntryType}/search`
                : `/api/v1/general-ledger/transaction/${transactionId}/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

// 8. ACCOUNTS
export const getPaginatedAccountGeneralLedger = async (
    accountId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    TEntryType: TEntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: TEntryType
                ? `/api/v1/general-ledger/account/${accountId}/${TEntryType}/search`
                : `/api/v1/general-ledger/account/${accountId}/search`,
            query: {
                sort: params.sort,
                filter: params.filters,
                pageIndex: params.pagination?.pageIndex,
                pageSize: params.pagination?.pageSize,
            },
        },
        { skipNull: true }
    )
    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

/*
Example usage:
    await getPaginatedEmployeeGeneralLedger(employeeId, { filters: 'base64', pagination: { pageIndex: 2, pageSize: 50 } }, 'payment-entry')
*/

// GET Total of Member Account General Ledger
export const getMemberAccountGeneralLedgerTotal = async (
    memberProfileId: TEntityId,
    accountId: TEntityId
) => {
    const response = await APIService.get<IMemberGeneralLedgerTotal>(
        `api/v1/general-ledger/member-profile/${memberProfileId}/account/${accountId}/total`
    )
    return response.data
}

export const getMemberAccountingLedgerTotal = async (id: TEntityId) => {
    const response = await APIService.get<IMemberAccountingLedgerTotal>(
        `/api/v1/member-accounting-ledger/member-profile/${id}/total`
    )
    return response.data
}

// ALL

export const getPaginatedGeneralLedger = async ({
    sort,
    filters,
    pagination,
    accountId,
}: {
    accountId: TEntityId
} & {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/general-ledger/account/${accountId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

export const getPaginatedGeneralLedgerTransaction = async ({
    sort,
    filters,
    pagination,
    transactionId,
}: {
    transactionId: TEntityId
} & {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/general-ledger/transaction/${transactionId}/search`,
            query: {
                sort,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IGeneralLedgerPaginated>(url)
    return response.data
}

export default {
    getGeneralLedgerByID,
    getPaginatedBranchGeneralLedger,
    getPaginatedCurrentGeneralLedger,
    getPaginatedEmployeeGeneralLedger,
    getPaginatedMemberGeneralLedger,

    getPaginatedMemberAccountGeneralLedger,
    getMemberAccountGeneralLedgerTotal,
    getMemberAccountingLedgerTotal,

    getPaginatedTransactionBatchGeneralLedger,
    getPaginatedTransactionGeneralLedger,
    getPaginatedAccountGeneralLedger,
    getPaginatedGeneralLedgerTransaction,
}
