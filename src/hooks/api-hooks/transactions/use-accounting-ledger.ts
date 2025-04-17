import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toBase64, withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import {
    IAccountingLedgerPaginatedResource,
    IAccountingLedgerResource,
} from '@/server/types/accounts/accounting-ledger'
import {
    IAPIHook,
    IAPIPreloads,
    IFilterPaginatedHookProps,
    IOperationCallbacks,
    IQueryProps,
} from '../types'
import { TEntityId } from '@/server'
import AccountingLedgerService from '@/server/api-service/transactions/accounting-ledger-service'

export const useCreateAccountingLedger = ({
    preloads = [],
    onError,
    onSuccess,
}: IOperationCallbacks<IAccountingLedgerResource> & IAPIPreloads) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, IAccountingLedgerResource>({
        mutationFn: async (newAccountingLedger) => {
            const [error, newLedger] = await withCatchAsync(
                AccountingLedgerService.create(newAccountingLedger, preloads)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onError?.(errorMessage)
                throw errorMessage
            }
            const cachedData =
                queryClient.getQueryData<IAccountingLedgerPaginatedResource>([
                    'accounting-ledger',
                    'resource-query',
                ])
            if (cachedData) {
                queryClient.setQueryData<IAccountingLedgerPaginatedResource>(
                    ['accounting-ledger', 'resource-query'],
                    {
                        ...cachedData,
                        data: [newLedger, ...cachedData.data],
                    }
                )
            }
            await queryClient.invalidateQueries({
                queryKey: ['accounting-ledger', 'resource-query'],
            })
            toast.success('Accounting ledger created successfully')
            onSuccess?.(newLedger)
        },
    })
}

export const useFilteredPaginatedIAccountingLedger = ({
    sort,
    enabled = true,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
    memberProfileId,
}: IFilterPaginatedHookProps &
    IQueryProps & {
        memberProfileId?: TEntityId
    } = {}) => {
    return useQuery<IAccountingLedgerPaginatedResource, string>({
        queryKey: [
            'accounting-ledger',
            'resource-query',
            JSON.stringify(filterPayload),
            memberProfileId,
            JSON.stringify(pagination),
            JSON.stringify(sort),
        ],
        queryFn: async () => {
            const filters = {
                ...(filterPayload || {}),
                ...(memberProfileId && { memberProfileId }),
            }
            const [error, result] = await withCatchAsync(
                AccountingLedgerService.getLedgers({
                    preloads,
                    pagination,
                    sort: sort ? toBase64(sort) : undefined,
                    filters: Object.keys(filters).length
                        ? toBase64(JSON.stringify(filters))
                        : undefined,
                })
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
    })
}

// for getting account ledger base on memberID
export const useGetAccountLedger = ({
    memberId,
    onError,
    onSuccess,
}: IAPIHook<IAccountingLedgerResource, string> & { memberId: TEntityId }) => {
    const queryClient = useQueryClient()

    return useQuery<IAccountingLedgerResource>({
        queryKey: ['accountLedger', memberId],
        queryFn: async () => {
            const cachedData =
                queryClient.getQueryData<IAccountingLedgerResource>([
                    'accountLedger',
                    memberId,
                ])
            if (cachedData) return cachedData
            const [error, data] = await withCatchAsync(
                AccountingLedgerService.getLedgerByMemberId(memberId)
            )
            if (error) {
                const errorMessage = error.message || 'An error occurred'
                onError?.(errorMessage) || toast.error(errorMessage)
                throw new Error(errorMessage)
            }
            onSuccess?.(data)
            queryClient.setQueryData(['accountLedger', memberId], data)

            return data
        },
        enabled: !!memberId,
    })
}
