import { useQuery } from '@tanstack/react-query'
import qs from 'query-string'

import { Logger } from '@/helpers/loggers'
import {
    HookQueryOptions,
    createDataLayerFactory,
} from '@/providers/repositories/data-layer-factory'
import { createMutationFactory } from '@/providers/repositories/mutation-factory'

import { TAPIQueryOptions, TEntityId } from '@/types'

import { loanTransactionBaseKey } from '../loan-transaction'
import { transactionBaseQueryKey } from '../transaction'
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

// 🪝 HOOK START HERE

export const { useGetById: useGetGeneralLedgerById } = apiCrudHooks

export type TGeneralLedgerEndpointMode =
    | 'all'
    | 'loan-transaction'
    | 'transaction'
    | 'member-accounting-ledger'
    | 'branch'
    | 'current'
    | 'employee'
    | 'member'
    | 'member-account'
    | 'transaction-batch'
    | 'transaction-batch-loan-entry'
    | 'account'

type TGeneralLedgerIdProps = {
    userOrganizationId?: TEntityId
    memberProfileId?: TEntityId
    accountId?: TEntityId
    transactionBatchId?: TEntityId
    transactionId?: TEntityId
    loanTransactionId?: TEntityId
    memberAccountingLedgerId?: TEntityId
}

type TBuildGeneralLedgerEndpointParams = {
    mode?: TGeneralLedgerEndpointMode
    query?: TAPIQueryOptions

    paginated?: boolean
    entryType?: TEntryType
} & TGeneralLedgerIdProps

export const buildGeneralLedgerEndpoint = ({
    mode = 'all',
    paginated = false,
    entryType,

    userOrganizationId,
    memberProfileId,
    accountId,
    transactionBatchId,
    transactionId,
    loanTransactionId,
    memberAccountingLedgerId,
}: TBuildGeneralLedgerEndpointParams): string => {
    const base = generalLedgerAPIRoute
    let path = ''

    const withSearch = (url: string) => (paginated ? `${url}/search` : url)

    const withEntryType = (url: string) =>
        entryType ? `${url}/${entryType}` : url

    switch (mode) {
        case 'all':
            return base

        case 'loan-transaction':
            if (!loanTransactionId)
                throw new Error('loanTransactionId is required')
            path = `/loan-transaction/${loanTransactionId}`
            break

        case 'transaction':
            if (!transactionId) throw new Error('transactionId is required')
            path = `/transaction/${transactionId}`
            break

        case 'member-accounting-ledger':
            if (!memberAccountingLedgerId)
                throw new Error('memberAccountingLedgerId is required')
            path = `/member-accounting-ledger/${memberAccountingLedgerId}`
            break

        case 'branch':
            path = `/branch`
            break

        case 'current':
            path = `/current`
            break

        case 'employee':
            if (!userOrganizationId)
                throw new Error('userOrganizationId is required')
            path = `/employee/${userOrganizationId}`
            break

        case 'member':
            if (!memberProfileId) throw new Error('memberProfileId is required')
            path = `/member-profile/${memberProfileId}`
            break

        case 'member-account':
            if (!memberProfileId) throw new Error('memberProfileId is required')
            if (!accountId) throw new Error('accountId is required')
            path = `/member-profile/${memberProfileId}/account/${accountId}`
            break

        case 'transaction-batch':
            if (!transactionBatchId)
                throw new Error('transactionBatchId is required')
            path = `/transaction-batch/${transactionBatchId}`
            break

        case 'transaction-batch-loan-entry':
            if (!transactionBatchId)
                throw new Error('transactionBatchId is required')
            path = `/transaction-batch/${transactionBatchId}/loan-entry`
            break

        case 'account':
            if (!accountId) throw new Error('accountId is required')
            path = `/account/${accountId}`
            break

        default:
            throw new Error(`Unsupported mode: ${mode}`)
    }

    let url = `${base}${path}`

    if (entryType) {
        url = withEntryType(url)
    }

    return withSearch(url)
}

export const useGetAllGeneralLedger = ({
    mode = 'all',
    entryType,
    query,
    options,
    accountId,
    transactionId,
    memberProfileId,
    loanTransactionId,
    transactionBatchId,
    memberAccountingLedgerId,
}: {
    mode?: TGeneralLedgerEndpointMode
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGeneralLedger[], Error>
    entryType?: TEntryType
} & TGeneralLedgerIdProps) => {
    return useQuery<IGeneralLedger[], Error>({
        ...options,
        queryKey: [
            generalLedgerBaseKey,
            'all',
            mode,
            accountId,
            transactionId,
            memberProfileId,
            loanTransactionId,
            transactionBatchId,
            memberAccountingLedgerId,
            entryType,
            query,
        ].filter(Boolean),

        queryFn: async () => {
            const buildedURL = buildGeneralLedgerEndpoint({
                mode,
                query,
                entryType,
                accountId,
                transactionId,
                memberProfileId,
                loanTransactionId,
                transactionBatchId,
                memberAccountingLedgerId,
            })

            const url = qs.stringifyUrl(
                {
                    url: buildedURL,
                    query,
                },
                { skipNull: true }
            )

            const response = await getAllGeneralLedgers({ url })
            return response
        },
    })
}

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
    mode?: TGeneralLedgerEndpointMode
    entryType?: TEntryType
    query?: TAPIQueryOptions
    options?: HookQueryOptions<IGeneralLedgerPaginated, Error>
} & TGeneralLedgerIdProps) => {
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
            const buildedURL = buildGeneralLedgerEndpoint({
                mode,
                paginated: true,
                userOrganizationId,
                memberProfileId,
                accountId,
                transactionBatchId,
                transactionId,
                entryType,
            })

            const url = qs.stringifyUrl(
                {
                    url: buildedURL,
                    query,
                },
                { skipNull: true }
            )

            return await getPaginatedGeneralLedger<IGeneralLedger>({
                url,
                query,
            })
        },
    })
}
export interface IChangeORRequest {
    or_from: string
    or_to: string
}

export const changeOR = async (payload: IChangeORRequest) => {
    return (await API.post(`${generalLedgerAPIRoute}/change/or`, payload)).data
}

export const useChangeOR = createMutationFactory<
    unknown,
    Error,
    IChangeORRequest
>({
    mutationFn: changeOR,
    defaultInvalidates: [
        [transactionBaseQueryKey],
        [loanTransactionBaseKey],
        [generalLedgerBaseKey],
        [transactionBaseQueryKey],
    ],
})

export const logger = Logger.getInstance('general-ledger')
