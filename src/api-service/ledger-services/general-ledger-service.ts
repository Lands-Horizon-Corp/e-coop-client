import qs from 'query-string'

import { IGeneralLedgerPaginated, TEntityId } from '@/types'

import APIService from '../api-service'

// Accept entry type as a string union type
export type EntryType =
    | ''
    | 'check-entry'
    | 'online-entry'
    | 'cash-entry'
    | 'payment-entry'
    | 'withdraw-entry'
    | 'deposit-entry'
    | 'journal-entry'
    | 'adjustment-entry'
    | 'journal-voucher'
    | 'check-voucher'

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
                ? `/general-ledger/branch/${entryType}/search`
                : `/general-ledger/branch/search`,
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
                ? `/general-ledger/current/${entryType}/search`
                : `/general-ledger/current/search`,
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
                ? `/general-ledger/employee/${userOrganizationId}/${entryType}/search`
                : `/general-ledger/employee/${userOrganizationId}/search`,
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
                ? `/general-ledger/member-profile/${memberProfileId}/${entryType}/search`
                : `/general-ledger/member-profile/${memberProfileId}/search`,
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
                ? `/general-ledger/member-profile/${memberProfileId}/account/${accountId}/${entryType}/search`
                : `/general-ledger/member-profile/${memberProfileId}/account/${accountId}/search`,
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
                ? `/general-ledger/transaction-batch/${transactionBatchId}/${entryType}/search`
                : `/general-ledger/transaction-batch/${transactionBatchId}/search`,
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
                ? `/general-ledger/transaction/${transactionId}/${entryType}/search`
                : `/general-ledger/transaction/${transactionId}/search`,
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
                ? `/general-ledger/account/${accountId}/${entryType}/search`
                : `/general-ledger/account/${accountId}/search`,
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

export default {
    getPaginatedBranchGeneralLedger,
    getPaginatedCurrentGeneralLedger,
    getPaginatedEmployeeGeneralLedger,
    getPaginatedMemberGeneralLedger,
    getPaginatedMemberAccountGeneralLedger,
    getPaginatedTransactionBatchGeneralLedger,
    getPaginatedTransactionGeneralLedger,
    getPaginatedAccountGeneralLedger,
}

/*
Example usage:
    await getPaginatedEmployeeGeneralLedger(employeeId, { filters: 'base64', pagination: { pageIndex: 2, pageSize: 50 } }, 'payment-entry')

*/
