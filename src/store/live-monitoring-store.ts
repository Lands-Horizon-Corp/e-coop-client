import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LiveMonitoringState {
    isLiveEnabled: boolean
}

interface LiveMonitoringActions {
    setLiveEnabled: (enabled: boolean) => void
    toggleLive: () => void
}

interface LiveMonitoringStore
    extends LiveMonitoringState,
        LiveMonitoringActions {}

export const useLiveMonitoringStore = create<LiveMonitoringStore>()(
    persist(
        (set) => ({
            isLiveEnabled: false,
            setLiveEnabled: (enabled) => set({ isLiveEnabled: enabled }),
            toggleLive: () =>
                set((state) => ({ isLiveEnabled: !state.isLiveEnabled })),
        }),
        {
            name: 'live-monitoring',
            partialize: (state) => ({
                isLiveEnabled: state.isLiveEnabled,
            }),
        }
    )
)
