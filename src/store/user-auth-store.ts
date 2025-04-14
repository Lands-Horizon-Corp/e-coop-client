import { create } from 'zustand'
// TODO: Set user data here once completed
// import { IUserData } from '@/server'

type TAuthStoreStatus = 'loading' | 'authorized' | 'unauthorized' | 'error'

interface UserAuthStore {
    currentUser: any | null
    authStatus: TAuthStoreStatus
    setCurrentUser: (newUserData: any | null) => void
    setAuthStatus: (status: TAuthStoreStatus) => void
}

export const useUserAuthStore = create<UserAuthStore>((set) => ({
    currentUser: null,
    authStatus: 'loading',
    setCurrentUser: (newUserData: any | null) =>
        set({
            currentUser: newUserData,
            authStatus: newUserData ? 'authorized' : 'unauthorized',
        }),
    setAuthStatus: (authStatus: TAuthStoreStatus) => set({ authStatus }),
}))

export const useAuthUser = <TUser = any /*extends IUserData */>() => {
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
