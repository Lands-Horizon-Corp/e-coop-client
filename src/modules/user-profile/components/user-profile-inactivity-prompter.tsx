import { useCallback, useEffect, useRef } from 'react'

import { useAuthStore } from '@/modules/authentication/authgentication.store'

import {
    loadUserProfileInactivitySettings,
    resolveInactivityDuration,
    useUserProfileInactivity,
} from '../hooks/use-user-profile-inactivity-hook'
import { useInactivityStore } from '../store/profile-inactivity-store'
import { UserInactivityPromptModal } from './modals/user-inactivity-modal'

const UserProfileInactivityPrompter = () => {
    const { authStatus } = useAuthStore()

    const {
        inactivityConfig,
        userActivityState,
        setInactivityConfig,
        setUserActivityState,
        setHandleRestartActivityTracking,
    } = useInactivityStore()

    const handleOnActivity = useCallback(() => {}, [])

    const handleOnInactivity = useCallback(() => {
        setUserActivityState('inactive')
    }, [setUserActivityState])

    const { restartTracking } = useUserProfileInactivity({
        activityGracePeriod: resolveInactivityDuration(
            inactivityConfig.timeUnit,
            inactivityConfig.duration
        ),
        onActivity: handleOnActivity,
        onInactivity: handleOnInactivity,
        disabled: authStatus !== 'authorized' || !inactivityConfig.enabled,
    })

    const restartTrackingRef = useRef(restartTracking)

    useEffect(() => {
        restartTrackingRef.current = restartTracking
        // console.log('restartTrackingRef updated')
    }, [restartTracking])

    useEffect(() => {
        const handleRestart = () => {
            restartTrackingRef.current()
            setUserActivityState('active')
        }

        // console.log('changes')

        setHandleRestartActivityTracking(handleRestart)
    }, [setHandleRestartActivityTracking, setUserActivityState])

    useEffect(() => {
        setUserActivityState('active')
    }, [setUserActivityState])

    useEffect(() => {
        if (authStatus === 'authorized') {
            restartTrackingRef.current()
            setUserActivityState('active')
        }
    }, [authStatus, setUserActivityState])

    useEffect(() => {
        const storedConfig = loadUserProfileInactivitySettings()
        if (storedConfig) {
            setInactivityConfig(storedConfig)
        }
    }, [setInactivityConfig])

    return (
        <UserInactivityPromptModal
            handleContinueSession={() => {
                restartTracking()
                setUserActivityState('active')
            }}
            open={
                userActivityState === 'inactive' && authStatus === 'authorized'
            }
        />
    )
}

export default UserProfileInactivityPrompter
