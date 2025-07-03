import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as CheckRemittanceService from '@/api-service/check-remittance-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import {
    IAPIHook,
    ICheckRemittance,
    ICheckRemittanceRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useCurrentBatchCheckRemittances = ({
    enabled,
    showMessage = true,
}: IAPIHook<ICheckRemittance[], string> & IQueryProps = {}) => {
    return useQuery<ICheckRemittance[], string>({
        queryKey: ['check-remittance', 'transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                CheckRemittanceService.currentTransactionBatchCheckRemittances()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}

export const useCreateBatchCheckRemittance = createMutationHook<
    ICheckRemittance,
    string,
    ICheckRemittanceRequest
>(
    (payload) =>
        CheckRemittanceService.createTransactionBatchCheckRemittance(payload),
    'Check Remittance Created'
)

export const useUpdateBatchCheckRemittance = createMutationHook<
    ICheckRemittance,
    string,
    { id: TEntityId; data: ICheckRemittanceRequest }
>(
    ({ id, data }) =>
        CheckRemittanceService.updateTransactionBatchCheckRemittance(id, data),
    'Check Remittance Updated'
)

export const useDeleteBatchCheckRemittance = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => CheckRemittanceService.deleteTransactionBatchCheckRemittance(id),
    'Check Remittance Deleted'
)
