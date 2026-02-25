import { useEffect, useRef, useState } from 'react'

import { useLiveMonitoringStore } from '@/store/live-monitoring-store'
import { usePusherStore } from '@/store/nats-pubsub-store'

export const usePusherConnect = () => {
    const initPusher = usePusherStore((state) => state.initPusher)
    useEffect(() => {
        initPusher()
    }, [initPusher])
}

export interface SubscribeOptions {
    delay?: number
    maxQueueSize?: number
    debounceTime?: number
}

export interface SubscribeStatus {
    isSyncing: boolean
    pendingCount: number
    isLive: boolean
}

export const useSubscribe = <T = unknown>(
    channelName: string,
    eventName: string,
    onReceive: (data: T) => void,
    options: SubscribeOptions = {}
) => {
    const { delay = 1000, maxQueueSize = 10, debounceTime = 300 } = options

    const pusher = usePusherStore((state) => state.pusher)
    const isLiveEnabled = useLiveMonitoringStore((state) => state.isLiveEnabled)

    const [status, setStatus] = useState<SubscribeStatus>({
        isSyncing: false,
        pendingCount: 0,
        isLive: isLiveEnabled,
    })

    const queueRef = useRef<T[]>([])
    const isProcessingRef = useRef(false)
    const onReceiveRef = useRef(onReceive)
    const configRef = useRef({ delay, maxQueueSize, debounceTime })
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const latestIncomingRef = useRef<T | null>(null)
    const lastEnqueueTimeRef = useRef<number>(0)

    // NEW: Track if the hook is still mounted/active to prevent zombie loops
    const isActiveRef = useRef<boolean>(true)

    // Keep refs up to date
    useEffect(() => {
        onReceiveRef.current = onReceive
        configRef.current = { delay, maxQueueSize, debounceTime }
    }, [onReceive, delay, maxQueueSize, debounceTime])

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
        if (channelName.includes('undefined') || channelName.includes('null'))
            return

        const processQueue = async () => {
            if (isProcessingRef.current || queueRef.current.length === 0) return
            isProcessingRef.current = true

            setStatus((prev) => ({ ...prev, isSyncing: true }))

            try {
                // FIXED: Check isActiveRef to prevent zombie loops after unmount
                while (queueRef.current.length > 0 && isActiveRef.current) {
                    // FIXED: Use shift() instead of pop() for First-In-First-Out (FIFO)
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
                // FIXED: Only reset if the queue is actually empty, preventing UI glitch
                if (isActiveRef.current) {
                    setStatus((prev) => ({
                        ...prev,
                        isSyncing: queueRef.current.length > 0,
                        pendingCount: queueRef.current.length,
                    }))

                    // If items sneaked in during the final delay, re-trigger
                    if (queueRef.current.length > 0) {
                        processQueue()
                    }
                }
            }
        }

        const handleData = (data: T) => {
            queueRef.current.push(data)

            // Limit queue size
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

        // FIXED: Extract listener to a named function for safe unbinding
        const handlePusherEvent = (incoming: { success: boolean; data: T }) => {
            const data =
                incoming?.success !== undefined
                    ? incoming.data
                    : (incoming as T)
            const now = Date.now()
            latestIncomingRef.current = data as T

            // LEADING EDGE
            if (
                queueRef.current.length === 0 &&
                !isProcessingRef.current &&
                now - lastEnqueueTimeRef.current >
                    configRef.current.debounceTime
            ) {
                handleData(data as T)
                return
            }

            // TRAILING EDGE
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

            debounceTimerRef.current = setTimeout(() => {
                if (latestIncomingRef.current) {
                    handleData(latestIncomingRef.current)
                    latestIncomingRef.current = null
                }
            }, configRef.current.debounceTime)

            handleData(data as T)
        }

        channel.bind(eventName, handlePusherEvent)

        return () => {
            isActiveRef.current = false

            // FIXED: Only unbind THIS specific listener
            channel.unbind(eventName, handlePusherEvent)

            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            queueRef.current = []
        }
    }, [pusher, channelName, eventName, isLiveEnabled])

    return status
}
