import { WS_URL } from '@/constants'
import { NatsConnection, connect } from 'nats.ws'
import { create } from 'zustand'

export interface INatsConnectOpts {
    wsUrl?: string
    onConnect?: () => void
    onError?: (err: unknown) => void
    onClosed?: (err?: unknown) => void
}

interface INatsState {
    connection: NatsConnection | null
    connect: (options?: INatsConnectOpts) => void
    disconnect: () => void
}

export const useNatsStore = create<INatsState>((set, get) => ({
    connection: null,

    connect: async ({ wsUrl = WS_URL, onConnect, onError, onClosed } = {}) => {
        const { connection } = get()
        if (connection) {
            console.warn('📡: already connected, reusing.')
            onConnect?.()
            return
        }

        try {
            const conn = await connect({ servers: wsUrl })
            set({ connection: conn })

            conn.closed().then((err) => {
                if (err) {
                    console.error(
                        '📡‧‧‧‧‧‧🔥‧‧‧‧‧‧🛰️: connection closed with error:',
                        err
                    )
                    onClosed?.(err)
                } else {
                    console.warn('📡😴: connection closed normally')
                    onClosed?.()
                }
                set({ connection: null })
            })

            console.info('📡‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧🛰️: Connected')
        } catch (error) {
            console.error('📡‧‧‧‧‧‧❌‧‧‧‧‧‧‧🛰️: failed to connect:', error)
            onError?.(error)
            throw error
        }
    },

    disconnect: async () => {
        const { connection } = get()
        if (!connection) {
            console.warn('📡💀: no connection to close.')
            return
        }
        await connection.close()
        set({ connection: null })
    },
}))
