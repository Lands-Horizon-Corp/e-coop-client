import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { HookQueryOptions } from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import {
    IGeneralLedger,
    IGeneralLedgerPaginated,
    IMemberGeneralLedgerTotal,
    TEntryType,
} from './general-ledger.types'

// ⚙️🛠️ API SERVICE HERE

export const { getPaginated, API, route } = createAPIRepository(
    '/api/v1/general-ledger'
)

// API function to get a general ledger by ID
export const getGeneralLedgerByID = async (
    id: TEntityId
): Promise<IGeneralLedger> => {
    const response = await API.get<IGeneralLedger>(`${route}/${id}`)
    return response.data
}

// API function to get total of member account general ledger
export const getMemberAccountGeneralLedgerTotal = async ({
    memberProfileId,
    accountId,
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
}): Promise<IMemberGeneralLedgerTotal> => {
    const response = await API.get<IMemberGeneralLedgerTotal>(
        `${route}/member-profile/${memberProfileId}/account/${accountId}/total`
    )
    return response.data
}

// 🪝 HOOK START HERE

// Exported mode for reuse
export type TGeneralLedgerMode =
    | 'branch'
    | 'current'
    | 'employee'
    | 'member'
    | 'member-account'
    | 'transaction-batch'
    | 'transaction'
    | 'account'

export const useFilteredPaginatedGeneralLedger = ({
    mode = 'branch', // Default mode is 'branch'
    TEntryType = '',
    userOrganizationId,
    memberProfileId,
    accountId,
    transactionBatchId,
    transactionId,
    query,
    options,
}: {
    mode?: TGeneralLedgerMode
    TEntryType?: TEntryType
    userOrganizationId?: TEntityId
    memberProfileId?: TEntityId
    accountId?: TEntityId
    transactionBatchId?: TEntityId
    transactionId?: TEntityId
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGeneralLedgerPaginated, Error>
}) => {
    return useQuery<IGeneralLedgerPaginated, Error>({
        ...options,
        queryKey: [
            'general-ledger',
            'filtered-paginated',
            mode,
            userOrganizationId,
            memberProfileId,
            accountId,
            transactionBatchId,
            transactionId,
            TEntryType,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url: string = `${route}/branch/search`

            switch (mode) {
                case 'branch':
                    url = TEntryType
                        ? `${route}/branch/${TEntryType}/search`
                        : `${route}/branch/search`
                    break

                case 'current':
                    url = TEntryType
                        ? `${route}/current/${TEntryType}/search`
                        : `${route}/current/search`
                    break

                case 'employee':
                    if (!userOrganizationId) {
                        throw new Error(
                            'userOrganizationId is required for employee mode'
                        )
                    }
                    url = TEntryType
                        ? `${route}/employee/${userOrganizationId}/${TEntryType}/search`
                        : `${route}/employee/${userOrganizationId}/search`
                    break

                case 'member':
                    if (!memberProfileId) {
                        throw new Error(
                            'memberProfileId is required for member mode'
                        )
                    }
                    url = TEntryType
                        ? `${route}/member-profile/${memberProfileId}/${TEntryType}/search`
                        : `${route}/member-profile/${memberProfileId}/search`
                    break

                case 'member-account':
                    if (!memberProfileId) {
                        throw new Error(
                            'memberProfileId is required for member-account mode'
                        )
                    }
                    if (!accountId) {
                        throw new Error(
                            'accountId is required for member-account mode'
                        )
                    }
                    url = TEntryType
                        ? `${route}/member-profile/${memberProfileId}/account/${accountId}/${TEntryType}/search`
                        : `${route}/member-profile/${memberProfileId}/account/${accountId}/search`
                    break

                case 'transaction-batch':
                    if (!transactionBatchId) {
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    }
                    url = TEntryType
                        ? `${route}/transaction-batch/${transactionBatchId}/${TEntryType}/search`
                        : `${route}/transaction-batch/${transactionBatchId}/search`
                    break

                case 'transaction':
                    if (!transactionId) {
                        throw new Error(
                            'transactionId is required for transaction mode'
                        )
                    }
                    url = TEntryType
                        ? `${route}/transaction/${transactionId}/${TEntryType}/search`
                        : `${route}/transaction/${transactionId}/search`
                    break

                case 'account':
                    if (!accountId) {
                        throw new Error(
                            'accountId is required for account mode'
                        )
                    }
                    url = TEntryType
                        ? `${route}/account/${accountId}/${TEntryType}/search`
                        : `${route}/account/${accountId}/search`
                    break

                default:
                    throw new Error(`Unsupported mode: ${mode}`)
            }

            const finalUrl = qs.stringifyUrl(
                {
                    url,
                    query,
                },
                { skipNull: true }
            )

            return await getPaginated<IGeneralLedger>({ url: finalUrl, query })
        },
    })
}

export const logger = Logger.getInstance('general-ledger')
