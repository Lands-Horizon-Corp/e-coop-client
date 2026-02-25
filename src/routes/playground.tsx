import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { useSubscribe } from '@/hooks/use-pubsub'

function RouteComponent() {
    const [live, setLive] = useState<{ timestamp: string }>()
    useSubscribe<{ timestamp: string }>('test', 'client-test', (data) =>
        setLive(data)
    )

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Playground</h1>
            <p>
                Status:{' '}
                <strong style={{ color: live ? 'green' : 'red' }}>
                    {live ? `Online ${new Date(live.timestamp)}` : 'Offline'}
                </strong>
            </p>
            <hr />
        </div>
    )
}

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})
