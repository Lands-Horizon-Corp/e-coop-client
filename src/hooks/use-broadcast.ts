import {
    connect,
    StringCodec,
    type NatsConnection,
    type Subscription,
} from 'nats.ws'
import { useEffect } from 'react'

import axios from 'axios'
export function useBroadcast<T = any>(
    subject: string,
    onMessage: (message: T) => void,
    onError: (error: Error) => void
): void {
    const health = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/health`,
                { withCredentials: true }
            )
            console.log('Health:', res.data)
        } catch (error) {
            console.error('Get Error:', error)
        }
    }

    ;('organization.$orgname.branch.$branchname.ledger.create')

    useEffect(() => {
        let isCancelled = false
        let nc: NatsConnection
        let sub: Subscription

        async function connectSocket() {
            try {
                await health()
                const sc = StringCodec()
                nc = await connect({
                    servers: import.meta.env.VITE_BROADCAST_URL,
                })
                sub = nc.subscribe(subject)
                ;(async () => {
                    for await (const msg of sub) {
                        if (isCancelled) break
                        const decoded = sc.decode(msg.data)
                        const parsed = JSON.parse(decoded) as T
                        onMessage(parsed)
                    }
                })()

                console.log(`connected to: ${subject}`)
            } catch (err: any) {
                if (!isCancelled) {
                    onError(err)
                }
            }
        }

        connectSocket()

        return () => {
            isCancelled = true
            if (sub) sub.unsubscribe()
            if (nc) nc.close()
        }
    }, [])
}
