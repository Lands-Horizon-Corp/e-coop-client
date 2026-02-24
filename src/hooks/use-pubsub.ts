import { useEffect } from 'react'

import { useLiveMonitoringStore } from '@/store/live-monitoring-store'
import { usePusherStore } from '@/store/nats-pubsub-store'

export const usePusherConnect = () => {
    const initPusher = usePusherStore((state) => state.initPusher)
    useEffect(() => {
        initPusher()
    }, [initPusher])
}

export const useSubscribe = <T = unknown>(
    channelName: string,
    eventName: string,
    onReceive: (data: T) => void
) => {
    const pusher = usePusherStore((state) => state.pusher)
    const isLiveEnabled = useLiveMonitoringStore((state) => state.isLiveEnabled)

    useEffect(() => {
        if (!pusher || !isLiveEnabled || !channelName || !eventName) return
        if (channelName.includes('undefined') || channelName.includes('null'))
            return

        const channel = pusher.subscribe(channelName)

        channel.bind(eventName, (incoming: { data: T; success: unknown }) => {
            const data =
                incoming?.success !== undefined ? incoming.data : incoming
            onReceive(data as T)
        })

        return () => {
            channel.unbind(eventName)
            pusher.unsubscribe(channelName)
        }
    }, [pusher, channelName, eventName, onReceive, isLiveEnabled])
}
