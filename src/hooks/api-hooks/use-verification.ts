import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { verifyWithPassword } from '@/api-service/security-services/auth-service'

import { IAPIHook, IVerificationPasswordRequest, IVerification } from '@/types'

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

            toast.success('Password verified successfully')
            onSuccess?.(data)
            return data
        },
    })
}
