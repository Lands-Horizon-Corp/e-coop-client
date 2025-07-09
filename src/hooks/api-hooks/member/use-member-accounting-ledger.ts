import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import memberAccountingLedgerService from '@/api-service/ledger-services/member-accounting-ledger-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIHook,
    IMemberAccountingLedgerPaginated,
    IMemberAccountingLedgerTotal,
} from '@/types'
import { IAPIFilteredPaginatedHook, IQueryProps, TEntityId } from '@/types'

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
                memberAccountingLedgerService.getMemberAccountingLedgerTotal(
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

export const useFilteredPaginatedMemberAccountingLedger = ({
    sort,
    enabled,
    filterPayload,
    memberProfileId,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
    ...other
}: { memberProfileId: TEntityId } & IAPIFilteredPaginatedHook<
    IMemberAccountingLedgerPaginated,
    string
> &
    IQueryProps) => {
    return useQuery<IMemberAccountingLedgerPaginated, string>({
        queryKey: [
            'member-accounting-ledger',
            memberProfileId,
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                memberAccountingLedgerService.getMemberAccountingLedger({
                    memberProfileId,
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
