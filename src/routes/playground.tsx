import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { SOKETI_HOST, SOKETI_KEY, SOKETI_PORT } from '@/constants'
import Pusher, { type Options } from 'pusher-js'

const DEFAULT_OPTIONS: Options = {
    wsHost: SOKETI_HOST,
    wsPort: SOKETI_PORT,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: 'mt1',
}

export const useSoketi = <T,>({
    channelName,
    eventName,
    callback,
    appKey = SOKETI_KEY,
    options = DEFAULT_OPTIONS,
}: {
    channelName: string
    eventName: string
    callback: (data: T) => void
    appKey?: string
    options?: Options
}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const pusher = new Pusher(appKey, options)
        const channel = pusher.subscribe(channelName)
        pusher.connection.bind('connected', () => {
            setIsConnected(true)
            setError(null)
        })
        pusher.connection.bind('error', (err: any) => {
            const msg =
                err?.error?.data?.code === 4004
                    ? 'App not found'
                    : 'Connection Refused'
            setError(msg)
        })
        channel.bind(eventName, (incoming: { success: boolean; data: T }) => {
            if (incoming.success) callback(incoming.data)
        })
        return () => {
            channel.unbind_all()
            pusher.unsubscribe(channelName)
            pusher.disconnect()
        }
    }, [channelName, eventName, callback, appKey, options])
    return { isConnected, error }
}
interface OrderData {
    message: string
    client: string
    time: string
}
function RouteComponent() {
    const { isConnected, error } = useSoketi<OrderData>({
        channelName: 'test',
        eventName: 'client-test',
        callback: (data) => {
            console.log(data)
        },
    })
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Soketi + Go + React</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <p>
                Status:{' '}
                <strong style={{ color: isConnected ? 'green' : 'red' }}>
                    {isConnected ? 'Online' : 'Offline'}
                </strong>
            </p>
            <hr />
        </div>
    )
}

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})
