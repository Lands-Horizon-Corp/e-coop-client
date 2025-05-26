import { toast } from 'sonner'
import { Navigate } from '@tanstack/react-router'

import { useAuthUser } from '@/store/user-auth-store'

import { IChildProps } from '@/types'

interface Props extends IChildProps {}

const UserOrgGuard = ({ children }: Props) => {
    const {
        currentAuth: { user_organization },
    } = useAuthUser()

    if (!user_organization) {
        toast.warning('Please select what org and branch to operate.')

        return <Navigate to={'/onboarding' as string} />
    }

    return children
}

export default UserOrgGuard
