import { useEffect, useRef, useState } from 'react'

import { useLiveMonitoringStore } from '@/store/live-monitoring-store'
import { usePusherStore } from '@/store/nats-pubsub-store'

export const usePusherConnect = (): void => {
    const initPusher = usePusherStore((state) => state.initPusher)
    useEffect(() => {
        initPusher()
    }, [initPusher])
}

export interface TSubscribeOptions {
    delay?: number
    maxQueueSize?: number
    debounceTime?: number
}

export const useSubscribe = <T = unknown>(
    channelName: string,
    eventName: string,
    onReceive: (data: T) => void,
    options: TSubscribeOptions = {}
) => {
    const pusher = usePusherStore((state) => state.pusher)
    const isLiveEnabled = useLiveMonitoringStore((state) => state.isLiveEnabled)
    const [status, setStatus] = useState({ isSyncing: false, pendingCount: 0 })
    const r = useRef({
        onReceive,
        config: { delay: 1000, maxQueueSize: 10, debounceTime: 300 },
        queue: [] as T[],
        isProcessing: false,
        isActive: true,
        latest: null as T | null,
        lastEnqueue: 0,
        timer: null as NodeJS.Timeout | null,
    })
    r.current.onReceive = onReceive
    r.current.config = { ...r.current.config, ...options }
    useEffect(() => {
        const state = r.current
        state.isActive = true
        if (!pusher || !isLiveEnabled || !channelName || !eventName) return
        if (channelName.includes('undefined') || channelName.includes('null'))
            return
        const syncStatus = () => {
            if (state.isActive) {
                setStatus({
                    isSyncing: state.isProcessing,
                    pendingCount: state.queue.length,
                })
            }
        }
        const processQueue = async () => {
            if (state.isProcessing || state.queue.length === 0) return
            state.isProcessing = true
            syncStatus()
            try {
                while (state.queue.length > 0 && state.isActive) {
                    const nextData = state.queue.shift()
                    syncStatus()
                    if (nextData !== undefined) {
                        state.onReceive(nextData)
                        await new Promise((res) =>
                            setTimeout(res, state.config.delay)
                        )
                    }
                }
            } finally {
                state.isProcessing = false
                syncStatus()
            }
        }
        const handleData = (data: T) => {
            state.queue.push(data)
            if (state.queue.length > state.config.maxQueueSize)
                state.queue.shift()
            state.lastEnqueue = Date.now()
            processQueue()
        }
        const channel = pusher.subscribe(channelName)
        const handleEvent = (incoming: any) => {
            const data =
                incoming?.success !== undefined ? incoming.data : incoming
            state.latest = data
            if (
                state.queue.length === 0 &&
                !state.isProcessing &&
                Date.now() - state.lastEnqueue > state.config.debounceTime
            )
                return handleData(data)
            if (state.timer) clearTimeout(state.timer)
            state.timer = setTimeout(() => {
                if (state.latest !== null) {
                    handleData(state.latest)
                    state.latest = null
                }
            }, state.config.debounceTime)
        }
        channel.bind(eventName, handleEvent)
        return () => {
            state.isActive = false
            channel.unbind(eventName, handleEvent)
            if (state.timer) clearTimeout(state.timer)
            state.queue = []
        }
    }, [pusher, channelName, eventName, isLiveEnabled])
    return { ...status, isLive: isLiveEnabled }
}
