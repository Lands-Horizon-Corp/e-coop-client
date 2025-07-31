import { useEffect } from 'react'
import { toast } from 'sonner'

import { useAuthUser } from '@/store/user-auth-store'
import { Navigate } from '@tanstack/react-router'

import {
    useSendHeartbeatOffline,
    useSendHeartbeatOnline,
} from '@/hooks/api-hooks/use-heartbeat'

import { IChildProps } from '@/types'

interface Props extends IChildProps {}

const UserOrgGuard = ({ children }: Props) => {
    const sendOnline = useSendHeartbeatOnline()
    const sendOffline = useSendHeartbeatOffline()

    const {
        currentAuth: { user_organization },
    } = useAuthUser()

    useEffect(() => {
        // Only start heartbeat if user_organization exists
        if (!user_organization) return

        // Send online heartbeat on mount and every 5s
        const sendHeartbeat = () => sendOnline.mutate()
        sendHeartbeat()

        // Mark offline on tab close
        const handleUnload = () => sendOffline.mutate()
        window.addEventListener('beforeunload', handleUnload)

        return () => {
            window.removeEventListener('beforeunload', handleUnload)
        }
    }, [user_organization])

    if (!user_organization) {
        toast.warning('Please select what org and branch to operate.')
        return <Navigate to={'/onboarding' as string} />
    }

    return children
}

export default UserOrgGuard
