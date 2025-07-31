import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    getHeartbeat,
    sendHeartbeatOffline,
    sendHeartbeatOnline,
    sendHeartbeatStatus,
} from '@/api-service/heartbeat.service'
import { serverRequestErrExtractor } from '@/helpers'
import {
    HeartbeatResponse,
    HeartbeatStatusChange,
} from '@/types/coop-types/heartbeat'
import { withCatchAsync } from '@/utils'

export const useHeartbeat = ({
    enabled = true,
    showMessage = true,
}: { enabled?: boolean; showMessage?: boolean } = {}) => {
    return useQuery<HeartbeatResponse, string>({
        queryKey: ['heartbeat', 'status'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(getHeartbeat())
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }
            return result
        },
        enabled,
        retry: 1,
    })
}

export const useSendHeartbeatOnline = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: sendHeartbeatOnline,
        onSuccess: () => {
            toast.success('Status set to online')
            queryClient.invalidateQueries({ queryKey: ['heartbeat', 'status'] })
        },
        onError: (error) => {
            toast.error(serverRequestErrExtractor({ error }))
        },
    })
}

export const useSendHeartbeatOffline = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: sendHeartbeatOffline,
        onSuccess: () => {
            toast.success('Status set to offline')
            queryClient.invalidateQueries({ queryKey: ['heartbeat', 'status'] })
        },
        onError: (error) => {
            toast.error(serverRequestErrExtractor({ error }))
        },
    })
}

export const useSendHeartbeatStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (status: HeartbeatStatusChange) =>
            sendHeartbeatStatus(status),
        onSuccess: () => {
            toast.success('Status updated')
            queryClient.invalidateQueries({ queryKey: ['heartbeat', 'status'] })
        },
        onError: (error) => {
            toast.error(serverRequestErrExtractor({ error }))
        },
    })
}
