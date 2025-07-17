import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import GeneralLedgerService from '@/api-service/ledger-services/general-ledger-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IGeneralLedgerPaginated,
    IMemberGeneralLedgerTotal,
    IQueryProps,
    TEntityId,
} from '@/types'

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
                GeneralLedgerService.getMemberAccountGeneralLedger({
                    memberProfileId,
                    accountId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
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

export const useFilteredPaginatedGeneralLedgerBasedonAccount = ({
    sort,
    enabled,
    accountId,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
    ...other
}: {
    accountId: TEntityId
} & IAPIFilteredPaginatedHook<IGeneralLedgerPaginated, string> &
    IQueryProps) => {
    return useQuery<IGeneralLedgerPaginated, string>({
        queryKey: [
            'general-ledger-based-on-account',
            accountId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerService.getPaginatedGeneralLedger({
                    accountId,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
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
