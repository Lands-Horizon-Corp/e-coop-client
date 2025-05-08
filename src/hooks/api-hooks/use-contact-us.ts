import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { createContactUs } from '@/api-service/contact-us-service'

import { IAPIHook, IMutationProps } from '../../types/api-hooks-types'
import { IContactUs, IContactUsRequest } from '@/types'

export const useCreateContactUs = ({
    onError,
    onSuccess,
    showMessage,
}: IAPIHook<IContactUs> & IMutationProps) => {
    return useMutation<IContactUs, string, IContactUsRequest>({
        mutationKey: ['send-contact-us'],
        mutationFn: async (contact) => {
            const [error, data] = await withCatchAsync(createContactUs(contact))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage, error)
                throw errorMessage
            }

            onSuccess?.(data)
            return data
        },
    })
}
