import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import DisbursementTransactionService from '@/api-service/disbursement-transaction-service'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IDisbursementTransactionPaginated,
    IQueryProps,
    TEntityId,
} from '@/types'

export type TDisbursementTransactionMode =
    | 'branch'
    | 'current'
    | 'employee'
    | 'transaction-batch'

export type TDisbursementTransactionHookProps = {
    mode: TDisbursementTransactionMode

    userOrganizationId?: TEntityId
    transactionBatchId?: TEntityId
} & IAPIFilteredPaginatedHook<IDisbursementTransactionPaginated> &
    IQueryProps

export const useFilteredPaginatedDisbursementTransaction = ({
    mode,
    userOrganizationId,
    transactionBatchId,
    sort,
    filterPayload,
    pagination = { pageSize: 10, pageIndex: 0 },
    showMessage = true,
    enabled,
    ...other
}: TDisbursementTransactionHookProps) => {
    const queryKey = [
        'disbursement-transaction',
        'resource-query',
        mode,
        userOrganizationId,
        transactionBatchId,
        filterPayload,
        pagination,
        sort,
    ].filter(Boolean)

    return useQuery<IDisbursementTransactionPaginated, string>({
        queryKey,
        queryFn: async () => {
            const params = {
                pagination,
                sort: sort && toBase64(sort),
                filter: filterPayload && toBase64(filterPayload),
            }

            let serviceCall: Promise<IDisbursementTransactionPaginated>

            switch (mode) {
                case 'branch':
                    serviceCall =
                        DisbursementTransactionService.getPaginatedBranchDisbursementTransaction(
                            params
                        )
                    break

                case 'current':
                    serviceCall =
                        DisbursementTransactionService.getPaginatedCurrentDisbursementTransaction(
                            params
                        )
                    break

                case 'employee':
                    if (!userOrganizationId)
                        throw new Error(
                            'userOrganizationId is required for employee mode'
                        )
                    serviceCall =
                        DisbursementTransactionService.getPaginatedEmployeeDisbursementTransaction(
                            userOrganizationId,
                            params
                        )
                    break

                case 'transaction-batch':
                    if (!transactionBatchId)
                        throw new Error(
                            'transactionBatchId is required for transaction-batch mode'
                        )
                    serviceCall =
                        DisbursementTransactionService.getPaginatedTransactionBatchDisbursementTransaction(
                            transactionBatchId,
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
