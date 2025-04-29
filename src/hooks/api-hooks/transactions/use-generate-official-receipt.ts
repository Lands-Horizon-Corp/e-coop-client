import { IGenerateORNumberResource } from '@/types'
import { IAPIHook } from '../types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { withCatchAsync } from '@/utils'
import OfficialReceiptService from '@/api-service/transactions/generate-or-number-service'
import { toast } from 'sonner'

export const useGenerateOfficialReceipt = ({
    onError,
    onSuccess,
}: IAPIHook<IGenerateORNumberResource, string>) => {
    const queryClient = useQueryClient()
    return useQuery<IGenerateORNumberResource>({
        queryKey: ['generate-or'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                OfficialReceiptService.get()
            )

            if (error) {
                const errorMessage = error.message || 'An error occurred'
                onError?.(errorMessage) || toast.error(errorMessage)
                throw new Error(errorMessage)
            }
            onSuccess?.(data)
            queryClient.setQueryData(['generate-or'], data)

            return data
        },
    })
}
