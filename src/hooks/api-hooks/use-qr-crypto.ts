import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { IMutationProps, IOperationCallbacks } from './types'
import QrCryptoService from '@/server/api-service/qr-crypto-service'

export const useQrDecryptData = <TResult = unknown>({
    showMessage,
    onError,
    onSuccess,
}: IOperationCallbacks<TResult, string> & IMutationProps = {}) => {
    return useMutation<TResult, string, string>({
        mutationKey: ['qr-decode'],
        mutationFn: async (data) => {
            const [error, result] = await withCatchAsync(
                QrCryptoService.decryptQrData<TResult>(data)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                if (onError) onError(errorMessage)
                throw errorMessage
            }

            onSuccess?.(result)

            return (
                typeof result === 'string' ? JSON.parse(result) : result
            ) as TResult
        },
    })
}
