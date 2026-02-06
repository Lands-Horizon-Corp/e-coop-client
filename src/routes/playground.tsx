// import { useSubscribe } from '@/hooks/use-pubsub'
import { useEffect } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { IS_STAGING, SOKETI_HOST, SOKETI_KEY, SOKETI_PORT } from '@/constants'
import Pusher from 'pusher-js'

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})

const client = new Pusher(SOKETI_KEY, {
    cluster: '', // not used
    wsHost: SOKETI_HOST,
    wsPort: Number(SOKETI_PORT),
    forceTLS: IS_STAGING,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
})

function RouteComponent() {
    useEffect(() => {
        // 1️⃣ Subscribe to channel
        const channel = client.subscribe('horizon')

        // 2️⃣ Bind to the event name (your Go appClient)
        channel.bind('pusher:subscription_succeeded', () => {
            console.log('Subscribed to horizon, now binding to events...')

            // Bind to the Go appClient name
            // channel.bind('ecoop', (data) => {
            //     console.log('Live tick:', data)
            // })
        })

        // Cleanup
        return () => {
            channel.unbind('horizon')
            client.unsubscribe('horizon')
        }
    }, [])

    return <div>Check console for live events</div>
}

export default RouteComponent
