import qs from 'query-string'

import {
    EntryType,
    IGeneralLedger,
    IGeneralLedgerPaginated,
    TEntityId,
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
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/branch/${entryType}/search`
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
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/current/${entryType}/search`
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
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/employee/${userOrganizationId}/${entryType}/search`
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
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/member-profile/${memberProfileId}/${entryType}/search`
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
export const getPaginatedMemberAccountGeneralLedger = async (
    memberProfileId: TEntityId,
    accountId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/member-profile/${memberProfileId}/account/${accountId}/${entryType}/search`
                : `/api/v1/general-ledger/member-profile/${memberProfileId}/account/${accountId}/search`,
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

// 6. TRANSACTION BATCH
export const getPaginatedTransactionBatchGeneralLedger = async (
    transactionBatchId: TEntityId,
    params: {
        sort?: string
        filters?: string
        pagination?: { pageIndex: number; pageSize: number }
    },
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/transaction-batch/${transactionBatchId}/${entryType}/search`
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
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/transaction/${transactionId}/${entryType}/search`
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
    entryType: EntryType = ''
) => {
    const url = qs.stringifyUrl(
        {
            url: entryType
                ? `/api/v1/general-ledger/account/${accountId}/${entryType}/search`
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
