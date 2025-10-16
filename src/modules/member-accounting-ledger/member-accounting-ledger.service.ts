import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import APIService from '@/providers/api'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { IMemberGeneralLedgerTotal } from '../general-ledger'
import {
    IMemberAccountingLedgerPaginated,
    IMemberAccountingLedgerTotal,
} from '../member-account-ledger'

// ⚙️🛠️ API SERVICE HERE

export const { getPaginated, API, route } = createAPIRepository(
    '/api/v1/member-accounting-ledger'
)

// API function to get the total accounting ledger for a member
export const getMemberAccountingLedgerTotal = async (
    id: TEntityId
): Promise<IMemberAccountingLedgerTotal> => {
    const response = await API.get<IMemberAccountingLedgerTotal>(
        `${route}/member-profile/${id}/total`
    )
    return response.data
}

// API function to get the total of a member general ledger of specific account
export const getMemberAccountGeneralLedgerTotal = async ({
    memberProfileId,
    accountId,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
}): Promise<IMemberGeneralLedgerTotal> => {
    const url = `${route}/member-profile/${memberProfileId}/account/${accountId}/total`
    const response = await API.get<IMemberGeneralLedgerTotal>(url)
    return response.data
}

// API function to get the accounting ledger for a branch
export const getAccountingLedger = async ({
    url,
    query,
}: {
    query?: TAPIQueryOptions
    url?: string
}): Promise<IMemberAccountingLedgerPaginated> => {
    const finalUrl = qs.stringifyUrl(
        {
            url: url || `${route}/branch/search`,
            query,
        },
        { skipNull: true }
    )

    const response =
        await APIService.get<IMemberAccountingLedgerPaginated>(finalUrl)
    return response.data
}

// 🪝 HOOKS START HERE

// Hook for fetching filtered and paginated accounting ledger

export type TMemberAccountingLedgerHookMode = 'member' | 'branch'

export const useFilteredPaginatedMemberAccountingLedger = ({
    mode = 'branch', // Default mode is now 'branch'
    memberProfileId,
    query,
    options,
}: {
    mode?: TMemberAccountingLedgerHookMode
    memberProfileId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberAccountingLedgerPaginated, Error>
}) => {
    return useQuery<IMemberAccountingLedgerPaginated, Error>({
        ...options,
        queryKey: [
            'member-accounting-ledger',
            'filtered-paginated',
            mode,
            memberProfileId,
            query,
        ],
        queryFn: async () => {
            let url: string = `${route}/branch/search`

            if (mode === 'member') {
                url = `${route}/member-profile/${memberProfileId}/search`
            }

            return getAccountingLedger({
                url,
                query,
            })
        },
    })
}

// Hook for fetching the total accounting ledger for a member
export const useMemberAccountingLedgerTotal = ({
    enabled,
    memberProfileId,
    options,
}: {
    memberProfileId: TEntityId
    enabled?: boolean
    options?: HookQueryOptions<IMemberAccountingLedgerTotal, Error>
}) => {
    return useQuery<IMemberAccountingLedgerTotal, Error>({
        ...options,
        queryKey: ['member-accounting-ledger', 'total', memberProfileId],
        queryFn: async () => getMemberAccountingLedgerTotal(memberProfileId),
        initialData: {
            total_deposits: 0,
            total_loans: 0,
            total_share_capital_plus_fixed_savings: 0,
        },
        enabled,
    })
}

// Hook for fetching the total of a member account general ledger
export const useMemberAccountGeneralLedgerTotal = ({
    accountId,
    memberProfileId,
    query,
    options,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IMemberGeneralLedgerTotal, Error>
}) => {
    return useQuery<IMemberGeneralLedgerTotal, Error>({
        ...options,
        queryKey: [
            'general-ledger',
            'member-profile',
            memberProfileId,
            'account',
            accountId,
            'total',
            query,
        ].filter(Boolean),
        queryFn: async () =>
            getMemberAccountGeneralLedgerTotal({ memberProfileId, accountId }),
    })
}

export const logger = Logger.getInstance('member-accounting-ledger')
