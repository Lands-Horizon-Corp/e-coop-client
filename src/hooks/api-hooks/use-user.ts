import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import { getUserMedias } from '@/api-service/user-service'

import { IAPIHook, IMedia, IQueryProps, TEntityId } from '@/types'

export const useMemberMedias = ({
    userId,
    onError,
    onSuccess,
    showMessage,
    ...other
}: { userId: TEntityId } & IQueryProps<IMedia[]> &
    Omit<IAPIHook<IMedia[], string>, 'preloads'>) => {
    return useQuery<IMedia[], string>({
        queryKey: ['user', userId, 'medias'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(getUserMedias(userId))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                onError?.(errorMessage)
                throw errorMessage
            }

            onSuccess?.(data)

            return data
        },
        ...other,
    })
}
