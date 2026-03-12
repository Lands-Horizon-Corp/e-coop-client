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
    eventName: string | null | undefined,
    onReceive: (data: T) => void,
    options: TSubscribeOptions = {}
) => {
    const pusher = usePusherStore((state) => state.pusher)
    const isLiveEnabled = useLiveMonitoringStore((state) => state.isLiveEnabled)

    const [status, setStatus] = useState({ isSyncing: false, pendingCount: 0 })

    const onReceiveRef = useRef(onReceive)
    onReceiveRef.current = onReceive

    const { delay = 1000, maxQueueSize = 10, debounceTime = 300 } = options

    useEffect(() => {
        let isActive = true
        let queue: T[] = []
        let isProcessing = false
        let timer: NodeJS.Timeout | null = null
        let latestData: T | null = null

        if (!pusher || !isLiveEnabled || !channelName || !eventName) return
        if (channelName.includes('undefined') || channelName.includes('null'))
            return

        const syncStatus = () => {
            if (isActive) {
                setStatus({
                    isSyncing: isProcessing,
                    pendingCount: queue.length,
                })
            }
        }

        const processQueue = async () => {
            if (isProcessing || queue.length === 0) return

            isProcessing = true
            syncStatus()

            try {
                while (queue.length > 0 && isActive) {
                    const nextData = queue.shift()
                    syncStatus()

                    if (nextData !== undefined) {
                        // Call the latest callback via Ref
                        onReceiveRef.current(nextData)

                        // Artificial delay between processing items
                        await new Promise((res) => setTimeout(res, delay))
                    }
                }
            } finally {
                isProcessing = false
                syncStatus()
            }
        }

        const handleDataPush = (data: T) => {
            if (!isActive) return
            queue.push(data)

            // Enforce max queue size (drop oldest)
            if (queue.length > maxQueueSize) {
                queue.shift()
            }

            processQueue()
        }

        // 2. Pusher Subscription
        const channel = pusher.subscribe(channelName)

        const handleEvent = (incoming: any) => {
            if (!isActive) return

            // Normalize incoming data structure
            const data =
                incoming?.success !== undefined ? incoming.data : incoming
            latestData = data

            // Debounce logic: wait for silence before adding to processing queue
            if (timer) clearTimeout(timer)

            timer = setTimeout(() => {
                if (isActive && latestData !== null) {
                    handleDataPush(latestData)
                    latestData = null
                }
            }, debounceTime)
        }

        channel.bind(eventName, handleEvent)

        // 3. Cleanup
        return () => {
            isActive = false
            if (timer) clearTimeout(timer)
            if (eventName) {
                channel.unbind(eventName, handleEvent)
            }
            // Reset status for the next ID/subscription
            setStatus({ isSyncing: false, pendingCount: 0 })
        }
    }, [
        pusher,
        channelName,
        eventName,
        isLiveEnabled,
        delay,
        maxQueueSize,
        debounceTime,
    ])

    return { ...status, isLive: isLiveEnabled }
}
