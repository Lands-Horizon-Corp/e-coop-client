import { create } from 'zustand'

import { IUserProfileInactivitySettings } from '../user-profile.types'

type userActivityState = 'active' | 'inactive'

interface IInactivityStore {
    inactivityConfig: IUserProfileInactivitySettings
    setInactivityConfig: (config: IUserProfileInactivitySettings) => void

    userActivityState: userActivityState
    setUserActivityState: (state: userActivityState) => void

    handleRestartActivityTracking: () => void
    setHandleRestartActivityTracking: (
        handleRestartActivityFn: () => void
    ) => void
}

export const useInactivityStore = create<IInactivityStore>((set) => ({
    inactivityConfig: {
        timeUnit: 'minutes',
        enabled: false,
        duration: 1,
    },
    setInactivityConfig: (config) => set({ inactivityConfig: config }),

    userActivityState: 'active',
    setUserActivityState: (state) => set({ userActivityState: state }),

    handleRestartActivityTracking: () => {},
    setHandleRestartActivityTracking: (restartFn) =>
        set({ handleRestartActivityTracking: restartFn }),
}))
