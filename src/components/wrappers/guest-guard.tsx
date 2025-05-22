import { Navigate } from '@tanstack/react-router'

import { IBaseProps } from '@/types'
import { useAuthStore } from '@/store/user-auth-store'

interface IGuestGuardProps extends Omit<IBaseProps, 'className'> {
    allowAuthenticatedUser?: false
}

const GuestGuard = ({
    allowAuthenticatedUser = false,
    children,
}: IGuestGuardProps) => {
    const {
        currentAuth: { user },
    } = useAuthStore()

    if (!allowAuthenticatedUser && user) {
        return (
            <div className="flex h-[100vh] flex-col items-center justify-center text-center">
                <div className="flex items-center gap-x-4 rounded-xl bg-popover p-4">
                    <p className="">Redirecting...</p>
                    <Navigate to={'/onboarding' as string} />
                </div>
            </div>
        )
    }

    return <>{children}</>
}

export default GuestGuard
