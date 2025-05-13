import { create } from 'zustand'
import { IAuthContext, IBranch, IOrganization, IUserBase } from '@/types'

type TAuthStoreStatus = 'loading' | 'authorized' | 'unauthorized' | 'error'

interface UserAuthStore {
    currentAuth: IAuthContext
    authStatus: TAuthStoreStatus
    setCurrentAuth: (newAuth: IAuthContext) => void
    updateCurrentAuth: (newAuth: Partial<IAuthContext>) => void
    setAuthStatus: (status: TAuthStoreStatus) => void
    resetAuth: (defaultAuthContextValue?: IAuthContext) => void
}

export const useAuthStore = create<UserAuthStore>((set) => ({
    currentAuth: {
        user: undefined,
        branch: undefined,
        organization: undefined,
        reports: [],
        role: [],
    },
    authStatus: 'loading',
    setCurrentAuth: (newAuth: IAuthContext) =>
        set({
            currentAuth: newAuth,
            authStatus: newAuth.user ? 'authorized' : 'unauthorized',
        }),
    updateCurrentAuth: (partialAuth) => {
        set((state) => ({
            currentAuth: {
                ...state.currentAuth,
                ...partialAuth,
            },
        }))
    },

    setAuthStatus: (authStatus: TAuthStoreStatus) => set({ authStatus }),
    resetAuth: (defaultAuthContextValue) => {
        set({
            currentAuth: defaultAuthContextValue ?? {
                user: undefined,
                branch: undefined,
                organization: undefined,
                reports: [],
                role: [],
            },
            authStatus: 'unauthorized',
        })
    },
}))

// USE only kapag sure ka na user ay existing
// ideal usage is in onboarding, since we dont care if nag eexist ang branch or organization sa authContext
export const useAuthUser = <TUser = IUserBase>() => {
    const { currentAuth, authStatus, ...rest } = useAuthStore((state) => state)

    if (
        !currentAuth.user ||
        authStatus === 'unauthorized' ||
        authStatus === 'error'
    ) {
        throw new Error(
            'User is not authenticated but tried to access protected data'
        )
    }

    return {
        ...rest,
        currentAuth: currentAuth as IAuthContext<TUser> & {
            user: NonNullable<typeof currentAuth.user>
        },
    }
}

// USE only kapag sure na user, organization, exist in user auth store
export const useAuthUserWithOrg = <TUser = IUserBase>() => {
    const { currentAuth, ...rest } = useAuthUser<TUser>()

    // if (!currentAuth.organization) {
    //     throw new Error('Authenticated user has no organization context.')
    // }

    return {
        ...rest,
        currentAuth: currentAuth as typeof currentAuth & {
            organization: NonNullable<IOrganization>
        },
    }
}

// USE only kapag sure na user, organization, branch, exist in user auth store
// ideal usage is in /org/:name/branch/:branchname/*
export const useAuthUserWithBranch = <TUser = IUserBase>() => {
    const { currentAuth, ...rest } = useAuthUserWithOrg<TUser>()

    // if (!currentAuth.branch) {
    //     throw new Error('Authenticated user has no branch context.')
    // }

    return {
        ...rest,
        currentAuth: currentAuth as typeof currentAuth & {
            branch: NonNullable<IBranch>
        },
    }
}
