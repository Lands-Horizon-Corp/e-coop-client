import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { serverRequestErrExtractor } from '@/helpers'
import * as UserService from '@/api-service/user-service'

import { IAPIHook, IMedia, IQueryProps, IUserBase, TEntityId } from '@/types'

export const useMemberMedias = ({
    userId,
    onError,
    onSuccess,
    showMessage,
    ...other
}: { userId: TEntityId } & IQueryProps<IMedia[]> &
    IAPIHook<IMedia[], string>) => {
    return useQuery<IMedia[], string>({
        queryKey: ['user', userId, 'medias'],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                UserService.getUserMedias(userId)
            )

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

export const useUser = ({
    userId,
    showMessage = false,
    onSuccess,
    onError,
    ...props
}: { userId: TEntityId } & IAPIHook<IUserBase> & IQueryProps<IUserBase>) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                UserService.getUserById(userId)
            )

            if (error) {
                const message = serverRequestErrExtractor({ error })

                if (showMessage) toast.error(message)
                onError?.(message, error)
                throw message
            }

            onSuccess?.(data)
            return data
        },
        ...props,
    })
}
