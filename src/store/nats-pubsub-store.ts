import { WS_URL } from '@/constants'
import logger from '@/helpers/loggers/logger'
// import logger from '@/helpers/loggers/logger'
import { NatsConnection, connect } from 'nats.ws'
import { create } from 'zustand'

export interface INatsConnectOpts {
    wsUrl?: string
    user?: string
    pass?: string
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

    connect: async ({
        wsUrl = WS_URL,
        onConnect,
        onError,
        onClosed,
        ...other
    } = {}) => {
        const { connection } = get()
        if (connection) {
            logger.warn('📡: already connected, reusing.')
            onConnect?.()
            return
        }

        try {
            const conn = await connect({
                servers: wsUrl,
                ...other,
            })
            set({ connection: conn })

            conn.closed().then((err) => {
                if (err) {
                    logger.error(
                        '📡‧‧‧‧‧‧🔥‧‧‧‧‧‧🛰️: connection closed with error:',
                        err
                    )
                    onClosed?.(err)
                } else {
                    logger.warn('📡😴: connection closed normally')
                    onClosed?.()
                }
                set({ connection: null })
            })

            logger.info('📡‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧🛰️: Connected')
        } catch (error) {
            logger.error('📡‧‧‧‧‧‧❌‧‧‧‧‧‧‧🛰️: failed to connect:', error)
            onError?.(error)
            throw error
        }
    },

    disconnect: async () => {
        const { connection } = get()
        if (!connection) {
            logger.warn('📡💀: no connection to close.')
            return
        }
        await connection.close()
        set({ connection: null })
    },
}))
