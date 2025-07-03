import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { verifyWithPassword } from '@/api-service/security-services/auth-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IVerification, IVerificationPasswordRequest } from '@/types'

export const useVerifyPassword = ({
    onError,
    onSuccess,
}: IAPIHook<IVerification, string>) => {
    return useMutation<IVerification, string, IVerificationPasswordRequest>({
        mutationFn: async (credentials: IVerificationPasswordRequest) => {
            const [error, data] = await withCatchAsync(
                verifyWithPassword(credentials)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
    })
}
