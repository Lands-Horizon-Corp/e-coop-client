import { toast } from 'sonner'
import {
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
    UseQueryResult,
} from '@tanstack/react-query'

// import { Role } from '@/types'
import { withCatchAsync } from '@/utils'
import { IOperationCallbacks } from './types'
import { serverRequestErrExtractor } from '@/helpers'
import { INotificationResource } from '@/server/types'
type Role = any
interface INotificationsProps {
    userId: number
    role: Role
}

const handleError = (error: unknown, onError?: (message: string) => void) => {
    const errorMessage = serverRequestErrExtractor({ error })
    toast.error(errorMessage)
    onError?.(errorMessage)
    throw new Error(errorMessage)
}

const handleSuccess = <TDataSuccess>(
    message: string,
    onSuccess?: (data: TDataSuccess) => void,
    data?: TDataSuccess
) => {
    toast.success(message)
    onSuccess?.(data as TDataSuccess)
}

// Load/get notifications
export const useNotifications = ({
    userId,
    role,
}: INotificationsProps): UseQueryResult<INotificationResource[], string> => {
    return useQuery<INotificationResource[], string>({
        queryKey: ['admin-notifications', userId, role],
        queryFn: async () => {
            // Replace with actual API call
            const [error, result] = await withCatchAsync(
                new Promise<INotificationResource[]>((resolve) => {
                    resolve([])
                })
            )

            if (error) {
                throw new Error(serverRequestErrExtractor({ error }))
            }

            return result
        },
    })
}

// Mark as read
export const useMarkasReadNotifications = ({
    onSuccess,
    onError,
}: IOperationCallbacks<INotificationResource, string>) => {
    const queryClient = useQueryClient()

    return useMutation<void, string, number>({
        mutationKey: ['notifications', 'mark-as-read'],
        mutationFn: async () => {
            // Replace with actual API call
            const [error] = await withCatchAsync(
                new Promise<void>((resolve) => {
                    resolve()
                })
            )

            if (error) {
                throw new Error('Failed to mark notification as read')
            }
        },
        onSuccess: (_, notificationId) => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            handleSuccess(
                `Notification #${notificationId} marked as read`,
                onSuccess
            )
        },
        onError: (error) => {
            handleError(error, onError)
        },
    })
}

// Delete notification
export const useDeleteNotifications = ({
    onSuccess,
    onError,
}: IOperationCallbacks): UseMutationResult<void, string, number> => {
    const queryClient = useQueryClient()

    return useMutation<void, string, number>({
        mutationKey: ['notifications', 'delete'],
        mutationFn: async () => {
            // Replace with actual API call
            const [error] = await withCatchAsync(
                new Promise<void>((resolve) => {
                    resolve()
                })
            )

            if (error) {
                throw new Error('Failed to delete notification')
            }
        },
        onSuccess: (_, notificationId) => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            handleSuccess(`Notification #${notificationId} deleted`, onSuccess)
        },
        onError: (error) => {
            handleError(error, onError)
        },
    })
}
