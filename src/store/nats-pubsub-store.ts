import {
    IS_STAGING,
    SOKETI_CLIENT,
    SOKETI_HOST,
    SOKETI_KEY,
    SOKETI_PORT,
} from '@/constants'
import logger from '@/helpers/loggers/logger'
import PusherJS, { Channel } from 'pusher-js'
import { create } from 'zustand'

export interface IPusherConnectOpts {
    key?: string
    host?: string
    port?: number
    client?: string
    onConnect?: () => void
    onError?: (err: unknown) => void
    onClosed?: () => void
}

interface IPusherState {
    channel: Channel | null
    connect: (opts?: IPusherConnectOpts) => void
}

export const usePusherStore = create<IPusherState>((set, get) => ({
    channel: null,

    connect: ({
        key = SOKETI_KEY!,
        host = SOKETI_HOST,
        port = SOKETI_PORT,
        onConnect,
        onError,
        onClosed,
    } = {}) => {
        if (get().channel) {
            logger.warn('📡: already connected to Pusher, reusing.')
            onConnect?.()
            return
        }

        try {
            const pusher = new PusherJS(key, {
                cluster: '',
                wsHost: host,
                wsPort: port,
                forceTLS: IS_STAGING,
                disableStats: true,
                enabledTransports: ['ws', 'wss'],
            })

            // Connection state events
            pusher.connection.bind('connected', () => {
                logger.info('📡🛰️: Pusher connected.')
                onConnect?.()
            })

            pusher.connection.bind('error', (err: any) => {
                logger.error('📡❌🛰️: Pusher connection error:', err)
                onError?.(err)
            })

            pusher.connection.bind('disconnected', () => {
                logger.warn('📡💤🛰️: Pusher disconnected.')
                onClosed?.()
                set({ channel: null })
            })

            set({ channel: pusher.subscribe(SOKETI_CLIENT) })
        } catch (error) {
            logger.error('📡🔥🛰️: Failed to connect to Pusher:', error)
            onError?.(error)
            throw error
        }
    },
}))
