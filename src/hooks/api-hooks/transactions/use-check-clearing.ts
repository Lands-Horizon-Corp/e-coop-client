import CheckClearingService from '@/api-service/transactions/check-clearing-service'
import { ICheckClearingRequest } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateCheckClearing = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: ICheckClearingRequest[]) => void
    onError?: (error: string) => void
}) => {
    return useMutation<
        ICheckClearingRequest[],
        string,
        ICheckClearingRequest[]
    >({
        mutationKey: ['check-clearing', 'create'],
        mutationFn: async (paymentData) => {
            try {
                console.log(
                    '⏳ Sending request to CheckClearingService.create...'
                )
                const response = await CheckClearingService.create(paymentData)
                onSuccess?.(response)
                return response
            } catch (error) {
                const errorMessage = 'Failed to process check clearing'
                console.log(error)
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
        },
    })
}
