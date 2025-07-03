import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as OnlineRemittanceService from '@/api-service/online-remittance-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import {
    IAPIHook,
    IOnlineRemitance,
    IOnlineRemitanceRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useCurrentBatchOnlineRemittances = ({
    enabled,
    showMessage = true,
}: IAPIHook<IOnlineRemitance[], string> & IQueryProps = {}) => {
    return useQuery<IOnlineRemitance[], string>({
        queryKey: ['online-remittance', 'transaction-batch', 'current'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                OnlineRemittanceService.currentTransactionBatchOnlineRemittances()
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

export const useCreateOnlineRemittance = createMutationHook<
    IOnlineRemitance,
    string,
    IOnlineRemitanceRequest
>(
    (payload) =>
        OnlineRemittanceService.createTransactionBatchOnlineRemittance(payload),
    'Online Remittance Created'
)

export const useUpdateOnlineRemittance = createMutationHook<
    IOnlineRemitance,
    string,
    { id: TEntityId; data: IOnlineRemitanceRequest }
>(
    ({ id, data }) =>
        OnlineRemittanceService.updateTransactionBatchOnlineRemittance(
            id,
            data
        ),
    'Online Remittance Updated'
)

export const useDeleteOnlineRemittance = createMutationHook<
    void,
    string,
    TEntityId
>(
    (id) => OnlineRemittanceService.deleteTransactionBatchOnlineRemittance(id),
    'Online Remittance Deleted'
)
