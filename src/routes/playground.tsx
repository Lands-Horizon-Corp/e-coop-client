import { createFileRoute } from '@tanstack/react-router'

import { useSubscribe } from '@/hooks/use-pubsub'

function RouteComponent() {
    console.log('Helo')
    useSubscribe('test', 'client-test', (data) => console.log(data))

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Soketi + Go + React</h1>

            {/* {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <p>
                Status:{' '}
                <strong style={{ color: isConnected ? 'green' : 'red' }}>
                    {isConnected ? 'Online' : 'Offline'}
                </strong>
            </p>
            <hr /> */}
        </div>
    )
}

export const Route = createFileRoute('/playground')({
    component: RouteComponent,
})
