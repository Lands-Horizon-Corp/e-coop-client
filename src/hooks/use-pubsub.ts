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
    options?: TSubscribeOptions
) => {
    const pusher = usePusherStore((state) => state.pusher)
    const isLiveEnabled = useLiveMonitoringStore((state) => state.isLiveEnabled)

    const [status, setStatus] = useState({
        isSyncing: false,
        pendingCount: 0,
        isLive: isLiveEnabled,
    })

    // Default configuration values
    const config = {
        delay: options?.delay ?? 1000,
        maxQueueSize: options?.maxQueueSize ?? 10,
        debounceTime: options?.debounceTime ?? 300,
    }

    const queueRef = useRef<T[]>([])
    const isProcessingRef = useRef(false)
    const onReceiveRef = useRef(onReceive)
    const configRef = useRef(config)
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const latestIncomingRef = useRef<T | null>(null)
    const lastEnqueueTimeRef = useRef<number>(0)
    const isActiveRef = useRef<boolean>(true)

    useEffect(() => {
        onReceiveRef.current = onReceive
        configRef.current = config
    }, [onReceive, config.delay, config.maxQueueSize, config.debounceTime])

    useEffect(() => {
        setStatus((prev) =>
            prev.isLive === isLiveEnabled
                ? prev
                : { ...prev, isLive: isLiveEnabled }
        )
    }, [isLiveEnabled])

    useEffect(() => {
        isActiveRef.current = true
        if (!pusher || !isLiveEnabled || !channelName || !eventName) return

        // Prevent subscribing to invalid names
        if (channelName.includes('undefined') || channelName.includes('null'))
            return

        const processQueue = async () => {
            if (isProcessingRef.current || queueRef.current.length === 0) return

            isProcessingRef.current = true
            setStatus((prev) => ({ ...prev, isSyncing: true }))

            try {
                while (queueRef.current.length > 0 && isActiveRef.current) {
                    const nextData = queueRef.current.shift()

                    setStatus((prev) => ({
                        ...prev,
                        pendingCount: queueRef.current.length,
                    }))

                    if (nextData !== undefined) {
                        onReceiveRef.current(nextData)
                        await new Promise((resolve) =>
                            setTimeout(resolve, configRef.current.delay)
                        )
                    }
                }
            } finally {
                isProcessingRef.current = false
                if (isActiveRef.current) {
                    const hasMore = queueRef.current.length > 0
                    setStatus((prev) => ({
                        ...prev,
                        isSyncing: hasMore,
                        pendingCount: queueRef.current.length,
                    }))
                    if (hasMore) {
                        processQueue()
                    }
                }
            }
        }
        const handleData = (data: T) => {
            queueRef.current.push(data)
            if (queueRef.current.length > configRef.current.maxQueueSize) {
                queueRef.current.shift()
            }
            setStatus((prev) => ({
                ...prev,
                pendingCount: queueRef.current.length,
            }))
            lastEnqueueTimeRef.current = Date.now()
            processQueue()
        }
        const channel = pusher.subscribe(channelName)
        const handlePusherEvent = (
            incoming: { success?: boolean; data?: T } | T
        ) => {
            const data =
                incoming &&
                typeof incoming === 'object' &&
                'success' in incoming
                    ? (incoming as { data: T }).data
                    : (incoming as T)
            const now = Date.now()
            latestIncomingRef.current = data
            const isIdle =
                queueRef.current.length === 0 && !isProcessingRef.current
            const isOutsideDebounce =
                now - lastEnqueueTimeRef.current >
                configRef.current.debounceTime
            if (isIdle && isOutsideDebounce) {
                handleData(data)
                return
            }
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            debounceTimerRef.current = setTimeout(() => {
                if (latestIncomingRef.current !== null) {
                    handleData(latestIncomingRef.current)
                    latestIncomingRef.current = null
                }
            }, configRef.current.debounceTime)
        }
        channel.bind(eventName, handlePusherEvent)
        return () => {
            isActiveRef.current = false
            channel.unbind(eventName, handlePusherEvent)
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            queueRef.current = []
        }
    }, [pusher, channelName, eventName, isLiveEnabled])
    return status
}
