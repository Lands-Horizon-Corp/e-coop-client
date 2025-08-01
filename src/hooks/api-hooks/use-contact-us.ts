import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createContactUs } from '@/api-service/contact-us-service'
import { serverRequestErrExtractor } from '@/helpers'
import { withCatchAsync } from '@/utils'

import { IContactUs, IContactUsRequest } from '@/types'

import { IAPIHook, IMutationProps } from '../../types/api-hooks-types'

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
