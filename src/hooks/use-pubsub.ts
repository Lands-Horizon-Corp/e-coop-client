import { useEffect } from 'react'

import { useLiveMonitoringStore } from '@/store/live-monitoring-store'
import {
    type IPusherConnectOpts,
    usePusherStore,
} from '@/store/nats-pubsub-store'

export const usePusherConnect = (opts?: IPusherConnectOpts) => {
    const connect = usePusherStore((state) => state.connect)

    useEffect(() => {
        connect(opts)
    }, [opts, connect])
}

export const useSubscribe = <T = unknown>(
    subject: string,
    onReceive?: (data: T) => void
) => {
    const connection = usePusherStore((state) => state.channel)
    const isLiveEnabled = useLiveMonitoringStore((state) => state.isLiveEnabled)

    useEffect(() => {
        if (
            !connection ||
            !isLiveEnabled ||
            subject.includes('undefined') ||
            subject.includes('null') ||
            subject === undefined ||
            subject === null
        ) {
            return
        }

        connection.bind(subject, (data: T) => {
            console.log('yes')
            onReceive?.(data)
        })

        return () => {}
    }, [connection, subject, onReceive, isLiveEnabled])
}
