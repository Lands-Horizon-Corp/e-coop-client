import {
    HeartbeatResponse,
    HeartbeatStatusChange,
} from '@/types/coop-types/heartbeat'

import APIService from './api-service'

export const getHeartbeat = async () => {
    const response = await APIService.get<HeartbeatResponse>('/heartbeat')
    return response.data
}

export const sendHeartbeatOnline = async () => {
    await APIService.post('/heartbeat/online')
}

export const sendHeartbeatOffline = async () => {
    await APIService.post('/heartbeat/offline')
}

export const sendHeartbeatStatus = async (status: HeartbeatStatusChange) => {
    await APIService.post<HeartbeatStatusChange>('/heartbeat', status)
}
