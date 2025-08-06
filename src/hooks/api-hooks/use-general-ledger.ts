import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import GeneralLedgerService from '@/api-service/ledger-services/general-ledger-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IGeneralLedgerPaginated,
    IMemberAccountingLedgerTotal,
    IMemberGeneralLedgerTotal,
    IQueryProps,
    TEntityId,
    TEntryType,
} from '@/types'

// TOTALS
export const useMemberAccountingLedgerTotal = ({
    enabled,
    memberProfileId,
    showMessage = true,
}: { memberProfileId: TEntityId } & IAPIHook<
    IMemberAccountingLedgerTotal,
    string
> &
    IQueryProps) => {
    return useQuery<IMemberAccountingLedgerTotal, string>({
        queryKey: ['member-accounting-ledger', 'total'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getMemberAccountingLedgerTotal(
                    memberProfileId
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            total_deposits: 0,
            total_loans: 0,
            total_share_capital_plus_fixed_savings: 0,
        },
        enabled,
        retry: 1,
    })
}

export const useMemberAccountGeneralLedgerTotal = ({
    enabled,
    accountId,
    memberProfileId,
    showMessage = true,
}: { memberProfileId: TEntityId; accountId: TEntityId } & IAPIHook<
    IMemberGeneralLedgerTotal,
    string
> &
    IQueryProps) => {
    return useQuery<IMemberGeneralLedgerTotal, string>({
        queryKey: [
            'general-ledger',
            'member-profile',
            memberProfileId,
            'account',
            accountId,
            'total',
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getMemberAccountGeneralLedgerTotal(
                    memberProfileId,
                    accountId
                )
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            balance: 0,
            total_credit: 0,
            total_debit: 0,
        },
        enabled,
        retry: 1,
    })
}
//-----

export const useFilteredPaginatedMemberAccountGeneralLedger = ({
    sort,
    enabled,
    accountId,
    filterPayload,
    memberProfileId,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
    ...other
}: {
    memberProfileId: TEntityId
    accountId: TEntityId
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated, string> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'general-ledger',
            'member-profile',
            memberProfileId,
            'account',
            accountId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedMemberAccountGeneralLedger({
                    memberProfileId,
                    accountId,
                    params: {
                        pagination,
                        sort: sort && toBase64(sort),
                        filter: filterPayload && toBase64(filterPayload),
                    },
                    EntryType: '',
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}

export type TGeneralLedgerMode =
    | 'branch'
    | 'current'
    | 'employee'
    | 'member'
    | 'member-account'
    | 'transaction-batch'
    | 'transaction'
    | 'account'

export type TGeneralLedgerHookProps = {
    mode: TGeneralLedgerMode
    TEntryType?: TEntryType

    // Kailangan optional desu
    userOrganizationId?: TEntityId
    memberProfileId?: TEntityId
    accountId?: TEntityId
    transactionBatchId?: TEntityId
    transactionId?: TEntityId
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated> &
    IQueryProps

export const useFilteredPaginatedGeneralLedger = ({
    mode,
    TEntryType = '',
    userOrganizationId,
    memberProfileId,
    accountId,
    transactionBatchId,
    transactionId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    showMessage = true,
    enabled,
    ...other
}: TGeneralLedgerHookProps) => {
    const queryKey = [
        'general-ledger',
        'resource-query',
        mode,
        userOrganizationId,
        memberProfileId,
        accountId,
        transactionBatchId,
        transactionId,
        TEntryType,
        filterPayload,
        pagination,
        sort,
    ].filter(Boolean)

    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey,
        queryFn: async () => {
            const params = {
                pagination,
                sort: sort && toBase64(sort),
                filter: filterPayload && toBase64(filterPayload),
            }

            let serviceCall: Promise<IGeneralLedgerPaginated>

            switch (mode) {
                case 'branch':
                    serviceCall =
                        GeneralLedgerService.getPaginatedBranchGeneralLedger(
                            params,
                            TEntryType
                        )
                    break

                case 'current':
                    serviceCall =
                        GeneralLedgerService.getPaginatedCurrentGeneralLedger(
                            params,
                            TEntryType
                        )
                    break

                case 'employee':
                    if (!userOrganizationId)
                        throw new Error(
                            'userOrganizationId is required for employee mode'
                        )
                    serviceCall =
                        GeneralLedgerService.getPaginatedEmployeeGeneralLedger(
                            userOrganizationId,
                            params,
                            TEntryType
                        )
                    break

                case 'member':
                    if (!memberProfileId)
                        throw new Error(
                            'memberProfileId is required for member mode'
                        )
                    serviceCall =
                        GeneralLedgerService.getPaginatedMemberGeneralLedger(
                            memberProfileId,
                            params,
                            TEntryType
                        )
                    break

                case 'member-account':
                    if (!memberProfileId)
                        throw new Error(
                            'memberProfileId is required for member-account mode'
                        )
                    if (!accountId)
                        throw new Error(
                            'accountId is required for member-account mode'
                        )
                    serviceCall =
                        GeneralLedgerService.getPaginatedMemberAccountGeneralLedger(
                            {
                                memberProfileId,
                                accountId,
                                params: {
                                    ...params,
                                    filter: params.filter,
                                },
                                EntryType: TEntryType,
                            }
                        )
                    break

                case 'transaction-batch':
                    if (!transactionBatchId)
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    serviceCall =
                        GeneralLedgerService.getPaginatedTransactionBatchGeneralLedger(
                            transactionBatchId,
                            params,
                            TEntryType
                        )
                    break

                case 'transaction':
                    if (!transactionId)
                        throw new Error(
                            'transactionId is required for transaction mode'
                        )
                    serviceCall =
                        GeneralLedgerService.getPaginatedTransactionGeneralLedger(
                            transactionId,
                            params,
                            TEntryType
                        )
                    break

                case 'account':
                    if (!accountId)
                        throw new Error(
                            'accountId is required for account mode'
                        )
                    serviceCall =
                        GeneralLedgerService.getPaginatedAccountGeneralLedger(
                            accountId,
                            params,
                            TEntryType
                        )
                    break

                default:
                    throw new Error(`Unsupported mode: ${mode}`)
            }

            const [error, result] = await withCatchAsync(serviceCall)

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
        ...other,
    })
}
