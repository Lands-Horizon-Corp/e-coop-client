import { IS_STAGING, SOKETI_HOST, SOKETI_KEY, SOKETI_PORT } from '@/constants'
import logger from '@/helpers/loggers/logger'
import Pusher, { type Options } from 'pusher-js'
import { create } from 'zustand'

interface PusherState {
    pusher: Pusher | null
    isConnected: boolean
    error: string | null
    initPusher: () => void
    disconnect: () => void
}

const DEFAULT_OPTIONS: Options = {
    wsHost: SOKETI_HOST,
    wsPort: SOKETI_PORT,
    forceTLS: IS_STAGING,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: 'mt1',
}

export const usePusherStore = create<PusherState>((set, get) => ({
    pusher: null,
    isConnected: false,
    error: null,

    initPusher: () => {
        if (get().pusher) return

        const pusher = new Pusher(SOKETI_KEY, DEFAULT_OPTIONS)

        pusher.connection.bind('connected', () => {
            logger.info('📡🛰️: Soketi connected.')
            set({ isConnected: true, error: null })
        })

        pusher.connection.bind('error', (err: any) => {
            const msg =
                err?.error?.data?.code === 4004
                    ? 'App not found'
                    : 'Connection Refused'
            logger.error('📡❌: Soketi error:', msg)
            set({ error: msg, isConnected: false })
        })

        pusher.connection.bind('disconnected', () => {
            set({ isConnected: false })
        })

        set({ pusher })
    },

    disconnect: () => {
        const { pusher } = get()
        if (pusher) {
            pusher.disconnect()
            set({ pusher: null, isConnected: false })
        }
    },
}))
