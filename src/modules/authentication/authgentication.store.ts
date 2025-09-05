import { IAuthContext } from '@/modules/authentication'
import { IBranch } from '@/modules/branch'
import { IOrganization } from '@/modules/organization'
import { IUserBase } from '@/modules/user'
import { IUserOrganization } from '@/modules/user-organization'
import { create } from 'zustand'

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
        user_organization: null,
        reports: [],
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
                user_organization: null,
                reports: [],
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

// USE only kapag sure na user, organization, exist in user auth store, pero not sure if may branch
export const useAuthUserWithOrg = <TUser = IUserBase>() => {
    const { currentAuth, ...rest } = useAuthUser<TUser>()

    // if (!currentAuth.organization) {
    //     throw new Error('Authenticated user has no organization context.')
    // }

    return {
        ...rest,
        currentAuth: currentAuth as typeof currentAuth & {
            user_organization: NonNullable<
                IUserOrganization & { organization: NonNullable<IOrganization> }
            >
        },
    }
}

// USE only kapag sure na user, organization, branch, exist in user auth store
// ideal usage is in /org/:name/branch/:branchname/*
export const useAuthUserWithOrgBranch = <TUser = IUserBase>() => {
    const { currentAuth, ...rest } = useAuthUserWithOrg<TUser>()

    if (
        !currentAuth.user_organization.branch ||
        !currentAuth.user_organization.organization
    ) {
        throw new Error(
            'Authenticated user has no branch or organization context.'
        )
    }

    return {
        ...rest,
        currentAuth: currentAuth as typeof currentAuth & {
            user_organization: IUserOrganization & {
                branch: NonNullable<IBranch>
            }
        },
    }
}
