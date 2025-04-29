import PaymentsEntryService from '@/api-service/transactions/payments-entry-service'
import { IPaymentsEntryRequest } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreatePaymentEntry = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: IPaymentsEntryRequest[]) => void
    onError?: (error: string) => void
}) => {
    return useMutation<
        IPaymentsEntryRequest[],
        string,
        IPaymentsEntryRequest[]
    >({
        mutationKey: ['payments-entry', 'create'],
        mutationFn: async (paymentData) => {
            try {
                const response = await PaymentsEntryService.create(paymentData)
                toast.success('Payment entry successfully created')
                onSuccess?.(response)
                return response
            } catch (error) {
                const errorMessage = 'Failed to create payment entry'
                console.error(errorMessage, error)
                toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }
        },
    })
}
