import { useEffect } from 'react'
import { StringCodec, Subscription } from 'nats.ws'
import { INatsConnectOpts, useNatsStore } from '@/store/nats-pubsub-store'

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

    useEffect(() => {
        if (!connection) return

        let sub: Subscription
        const subHandler = async () => {
            sub = connection.subscribe(subject)

            if (sub) {
                console.log('👂: Subscribed to ', subject)
            }

            for await (const msg of sub) {
                const decodedData = sc.decode(msg.data)
                const parsedData = JSON.parse(decodedData)
                onReceive?.(parsedData)
            }
        }

        subHandler()

        return () => {
            sub?.unsubscribe()
        }
    }, [connection, subject, onReceive])
}

// export function useBroadcastx<T = any>(
//     subject: string,
//     onMessage: (message: T) => void,
//     onError: (error: Error) => void
// ): void {
//     const health = async () => {
//         try {
//             const res = await axios.get(
//                 `${import.meta.env.VITE_API_BASE_URL}/health`,
//                 { withCredentials: true }
//             )
//             console.log('Health:', res.data)
//         } catch (error) {
//             console.error('Get Error:', error)
//         }
//     }

//     useEffect(() => {
//         let isCancelled = false
//         let nc: NatsConnection
//         let sub: Subscription

//         async function connectSocket() {
//             try {
//                 await health()
//                 const sc = StringCodec()
//                 nc = await connect({
//                     servers: import.meta.env.VITE_BROADCAST_URL,
//                 })
//                 sub = nc.subscribe(subject)
//                 ;(async () => {
//                     for await (const msg of sub) {
//                         if (isCancelled) break
//                         const decoded = sc.decode(msg.data)
//                         const parsed = JSON.parse(decoded) as T
//                         onMessage(parsed)
//                     }
//                 })()

//                 console.log(`connected to: ${subject}`)
//             } catch (err: any) {
//                 if (!isCancelled) {
//                     onError(err)
//                 }
//             }
//         }

//         connectSocket()

//         return () => {
//             isCancelled = true
//             if (sub) sub.unsubscribe()
//             if (nc) nc.close()
//         }
//     }, [])
// }
