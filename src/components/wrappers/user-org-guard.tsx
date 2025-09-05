import { useEffect } from 'react'

import { Navigate } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import {
    useSendHeartbeatOffline,
    useSendHeartbeatOnline,
} from '@/modules/heartbeat/heartbeat.service'

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!user_organization) {
        return <Navigate to={'/onboarding' as string} />
    }

    return children
}

export default UserOrgGuard
