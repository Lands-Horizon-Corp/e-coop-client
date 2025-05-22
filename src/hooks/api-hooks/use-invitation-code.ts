import { InvitationCodeService } from '@/api-service/invitation-code-services'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useVerifyInvitationCode = (code: string) => {
    return useQuery({
        queryKey: ['invitation-code', code],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                InvitationCodeService.verifyInvitationCode(code)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw new Error(errorMessage)
            }

            return response
        },
        enabled: !!code, 
        staleTime: 5000
    })
}
