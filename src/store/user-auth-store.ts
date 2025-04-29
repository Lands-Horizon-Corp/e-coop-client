import { create } from 'zustand'
import { IUserData } from '@/types'

type TAuthStoreStatus = 'loading' | 'authorized' | 'unauthorized' | 'error'

interface UserAuthStore {
    currentUser: IUserData | null
    authStatus: TAuthStoreStatus
    setCurrentUser: (newUserData: IUserData | null) => void
    setAuthStatus: (status: TAuthStoreStatus) => void
}

export const useUserAuthStore = create<UserAuthStore>((set) => ({
    currentUser: null,
    authStatus: 'loading',
    setCurrentUser: (newUserData: IUserData | null) =>
        set({
            currentUser: newUserData,
            authStatus: newUserData ? 'authorized' : 'unauthorized',
        }),
    setAuthStatus: (authStatus: TAuthStoreStatus) => set({ authStatus }),
}))

export const useAuthUser = <TUser extends IUserData>() => {
    const { currentUser, setCurrentUser, setAuthStatus } = useUserAuthStore(
        (state) => state
    )

    if (!currentUser) {
        throw new Error(
            'User is not authenticated but tried to access protected data'
        )
    }

    return {
        currentUser: currentUser as TUser,
        setCurrentUser: setCurrentUser as (newUserData: TUser | null) => void,
        setAuthStatus,
    }
}
