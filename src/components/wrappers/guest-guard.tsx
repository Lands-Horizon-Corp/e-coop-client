import { Navigate, useSearch } from '@tanstack/react-router'

import { useAuthStore } from '@/store/user-auth-store'

import { IBaseProps } from '@/types'

interface IGuestGuardProps extends Omit<IBaseProps, 'className'> {
    allowAuthenticatedUser?: false
}

const GuestGuard = ({
    allowAuthenticatedUser = false,
    children,
}: IGuestGuardProps) => {
    const { cbUrl } = useSearch({ strict: false }) as { cbUrl?: string }
    const {
        currentAuth: { user },
    } = useAuthStore()

    if (!allowAuthenticatedUser && user) {
        return (
            <div className="flex h-[100vh] flex-col items-center justify-center text-center">
                <div className="flex items-center gap-x-4 rounded-xl bg-popover p-4">
                    <p className="">Redirecting...</p>
                    {cbUrl ? (
                        <Navigate to={cbUrl as string} />
                    ) : (
                        <Navigate to={'/onboarding' as string} />
                    )}
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export default GuestGuard
