import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import {
    IGeneralLedger,
    IGeneralLedgerPaginated,
    IMemberGeneralLedgerTotal,
    TEntryType,
} from './general-ledger.types'

// ⚙️🛠️ API SERVICE HERE

export const {
    apiCrudHooks,
    apiCrudService,
    baseQueryKey: generalLedgerBaseKey,
} = createDataLayerFactory<IGeneralLedger, void>({
    baseKey: 'general-ledger',
    url: '/api/v1/general-ledger',
})

export const { useGetById: getGeneralLedgerId } = apiCrudHooks

export const {
    API,
    route: generalLedgerAPIRoute,
    getAll: getAllGeneralLedgers,
    getPaginated: getPaginatedGeneralLedger,
} = apiCrudService

// API function to get a general ledger by ID
export const getGeneralLedgerByID = async (
    id: TEntityId
): Promise<IGeneralLedger> => {
    const response = await API.get<IGeneralLedger>(
        `${generalLedgerAPIRoute}/${id}`
    )
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
        `${generalLedgerAPIRoute}/member-profile/${memberProfileId}/account/${accountId}/total`
    )
    return response.data
}

export type TGetAllGeneralLedgerMode =
    | 'all'
    | 'loan-transaction'
    | 'transaction'
    | 'member-accounting-ledger'

export const getAllGeneralLedger = async ({
    mode,
    transactionId,
    loanTransactionId,
    memberAccountingLedgerId,
}: {
    mode?: TGetAllGeneralLedgerMode
    loanTransactionId?: TEntityId
    transactionId?: TEntityId
    memberProfileId?: TEntityId
    memberAccountingLedgerId?: TEntityId
    accountId?: TEntityId
}) => {
    let url = `${generalLedgerAPIRoute}`

    if (mode === 'loan-transaction' && loanTransactionId) {
        url = `${generalLedgerAPIRoute}/loan-transaction/${loanTransactionId}`
    } else if (mode === 'transaction' && transactionId) {
        url = `${generalLedgerAPIRoute}/transaction/${transactionId}`
    } else if (
        mode === 'member-accounting-ledger' &&
        memberAccountingLedgerId !== undefined
    ) {
        url = `${generalLedgerAPIRoute}/member-accounting-ledger/${memberAccountingLedgerId}/`
    }

    const response = await getAllGeneralLedgers({ url })
    return response
}

// 🪝 HOOK START HERE

export const { useGetById: useGetGeneralLedgerById } = apiCrudHooks

export const useGetAllGeneralLedger = ({
    mode = 'all',
    query,
    options,
    accountId,
    transactionId,
    memberProfileId,
    loanTransactionId,
    memberAccountingLedgerId,
}: {
    mode?: TGetAllGeneralLedgerMode
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGeneralLedger[], Error>

    memberAccountingLedgerId?: TEntityId
    loanTransactionId?: TEntityId
    transactionId?: TEntityId
    memberProfileId?: TEntityId
    accountId?: TEntityId
}) => {
    return useQuery<IGeneralLedger[], Error>({
        ...options,
        queryKey: [
            generalLedgerBaseKey,
            'all',
            mode,
            query,
            accountId,
            transactionId,
            memberProfileId,
            loanTransactionId,
            memberAccountingLedgerId,
        ].filter(Boolean),
        queryFn: async () =>
            getAllGeneralLedger({
                mode,
                accountId,
                transactionId,
                memberProfileId,
                loanTransactionId,
                memberAccountingLedgerId,
            }),
    })
}

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
    entryType = '',
    userOrganizationId,
    memberProfileId,
    accountId,
    transactionBatchId,
    transactionId,
    query,
    options,
}: {
    mode?: TGeneralLedgerMode
    entryType?: TEntryType
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
            generalLedgerBaseKey,
            'filtered-paginated',
            mode,
            userOrganizationId,
            memberProfileId,
            accountId,
            transactionBatchId,
            transactionId,
            entryType,
            query,
        ].filter(Boolean),
        queryFn: async () => {
            let url: string = `${generalLedgerAPIRoute}/branch/search`

            switch (mode) {
                case 'branch':
                    url = entryType
                        ? `${generalLedgerAPIRoute}/branch/${entryType}/search`
                        : `${generalLedgerAPIRoute}/branch/search`
                    break

                case 'current':
                    url = entryType
                        ? `${generalLedgerAPIRoute}/current/${entryType}/search`
                        : `${generalLedgerAPIRoute}/current/search`
                    break

                case 'employee':
                    if (!userOrganizationId) {
                        throw new Error(
                            'userOrganizationId is required for employee mode'
                        )
                    }
                    url = entryType
                        ? `${generalLedgerAPIRoute}/employee/${userOrganizationId}/${entryType}/search`
                        : `${generalLedgerAPIRoute}/employee/${userOrganizationId}/search`
                    break

                case 'member':
                    if (!memberProfileId) {
                        throw new Error(
                            'memberProfileId is required for member mode'
                        )
                    }
                    url = entryType
                        ? `${generalLedgerAPIRoute}/member-profile/${memberProfileId}/${entryType}/search`
                        : `${generalLedgerAPIRoute}/member-profile/${memberProfileId}/search`
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
                    url = entryType
                        ? `${generalLedgerAPIRoute}/member-profile/${memberProfileId}/account/${accountId}/${entryType}/search`
                        : `${generalLedgerAPIRoute}/member-profile/${memberProfileId}/account/${accountId}/search`
                    break

                case 'transaction-batch':
                    if (!transactionBatchId) {
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    }
                    url = entryType
                        ? `${generalLedgerAPIRoute}/transaction-batch/${transactionBatchId}/${entryType}/search`
                        : `${generalLedgerAPIRoute}/transaction-batch/${transactionBatchId}/search`
                    break

                case 'transaction':
                    if (!transactionId) {
                        throw new Error(
                            'transactionId is required for transaction mode'
                        )
                    }
                    url = entryType
                        ? `${generalLedgerAPIRoute}/transaction/${transactionId}/${entryType}/search`
                        : `${generalLedgerAPIRoute}/transaction/${transactionId}/search`
                    break

                case 'account':
                    if (!accountId) {
                        throw new Error(
                            'accountId is required for account mode'
                        )
                    }
                    url = entryType
                        ? `${generalLedgerAPIRoute}/account/${accountId}/${entryType}/search`
                        : `${generalLedgerAPIRoute}/account/${accountId}/search`
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

            return await getPaginatedGeneralLedger<IGeneralLedger>({
                url: finalUrl,
                query,
            })
        },
    })
}

export const logger = Logger.getInstance('general-ledger')
