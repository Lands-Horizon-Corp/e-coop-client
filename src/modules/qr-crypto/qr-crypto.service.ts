import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { withCatchAsync } from '@/helpers/function-utils'
import { Logger } from '@/helpers/loggers'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'

import { IOperationCallbacks } from './qr-crypto.types'

const { API, route } = createAPIRepository('/api/v1/qr-code')

export const decryptQrData = async <TResponseData = unknown>(
    encryptedData: string
) => {
    const endpoint = `${route}/${encryptedData}`
    return (await API.get<TResponseData>(endpoint)).data
}

export const useQrDecryptData = <TResult = unknown>({
    showMessage,
    onError,
    onSuccess,
}: IOperationCallbacks<TResult, string> & { showMessage?: boolean } = {}) => {
    return useMutation<TResult, string, string>({
        mutationKey: ['qr-decode'],
        mutationFn: async (data) => {
            const [error, result] = await withCatchAsync(
                decryptQrData<TResult>(data)
            )

            if (error) {
                const errorMessage =
                    serverRequestErrExtractor({ error }) ?? 'Unknown error'
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

export const logger = Logger.getInstance('qr-crypto')
