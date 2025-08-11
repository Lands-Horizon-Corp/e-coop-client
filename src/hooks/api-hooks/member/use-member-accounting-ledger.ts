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

export type TMemberAccountingLedgerMode = 'member' | 'branch'

export type TMemberAccountingLedgerHookProps = {
    mode: TMemberAccountingLedgerMode
    memberProfileId?: TEntityId
} & IAPIFilteredPaginatedHook<IMemberAccountingLedgerPaginated> &
    IQueryProps

export const useFilteredPaginatedMemberAccountingLedger = ({
    mode,
    memberProfileId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 1 },
    showMessage = true,
    enabled,
    ...other
}: TMemberAccountingLedgerHookProps) => {
    const queryKey = [
        'member-accounting-ledger',
        'resource-query',
        mode,
        memberProfileId,
        filterPayload,
        pagination,
        sort,
    ].filter(Boolean)

    return useQuery<IMemberAccountingLedgerPaginated, string>({
        queryKey,
        queryFn: async () => {
            const params = {
                pagination,
                sort: sort && toBase64(sort),
                filters: filterPayload && toBase64(filterPayload),
            }

            let serviceCall: Promise<IMemberAccountingLedgerPaginated>

            switch (mode) {
                case 'member':
                    if (!memberProfileId)
                        throw new Error(
                            'memberProfileId is required for member mode'
                        )
                    serviceCall =
                        memberAccountingLedgerService.getMemberAccountingLedger(
                            {
                                memberProfileId,
                                ...params,
                            }
                        )
                    break

                case 'branch':
                    serviceCall =
                        memberAccountingLedgerService.getBranchAccountingLedger(
                            params
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
