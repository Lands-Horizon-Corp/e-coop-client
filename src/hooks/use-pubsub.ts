import { useEffect } from 'react'

import { NATS_CLIENT } from '@/constants'
import { useLiveMonitoringStore } from '@/store/live-monitoring-store'
// import logger from '@/helpers/loggers/logger'
import { type INatsConnectOpts, useNatsStore } from '@/store/nats-pubsub-store'
import { StringCodec, type Subscription } from 'nats.ws'

const sc = StringCodec()

export const useNatsConnect = (opts?: INatsConnectOpts) => {
    const connect = useNatsStore((state) => state.connect)

    useEffect(() => {
        connect(opts)
    }, [opts, connect])
}

export const useSubscribe = <T = unknown>(
    subject: string,
    onReceive?: (data: T) => void
) => {
    const connection = useNatsStore((state) => state.connection)
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
        let sub: Subscription
        const subHandler = async () => {
            sub = connection.subscribe(`${NATS_CLIENT}${subject}`)

            for await (const msg of sub) {
                const decodedData = sc.decode(msg.data)
                const parsedData = JSON.parse(decodedData)
                onReceive?.(parsedData)
            }
        }

        subHandler()

        return () => {
            if (sub) {
                sub.unsubscribe()
            }
        }
    }, [connection, subject, onReceive, isLiveEnabled])
}
