import { useCallback } from 'react'

import { AxiosError } from 'axios'

import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { useAuthContext } from '../authentication.service'
import { IAuthContext } from '../authentication.types'
import { useAuthStore } from '../authgentication.store'

const AuthLoader = () => {
    const { setAuthStatus, setCurrentAuth, resetAuth } = useAuthStore()

    const { error, isError, data, isSuccess } = useAuthContext({
        options: {
            // refetchOnWindowFocus: false,
            retry: 0,
        },
    })

    const handleSuccess = useCallback(
        (authorizationContext: IAuthContext) => {
            setCurrentAuth(authorizationContext)
            setAuthStatus('authorized')
        },
        [setAuthStatus, setCurrentAuth]
    )

    const handleError = useCallback(
        (rawError: Error) => {
            if (rawError instanceof AxiosError && rawError.status === 401) {
                resetAuth()
                setAuthStatus('unauthorized')
                return null
            }
            if (rawError instanceof AxiosError && rawError.status === 500) {
                setAuthStatus('error')
                return null
            }
            setAuthStatus('error')
        },
        [resetAuth, setAuthStatus]
    )

    // TODO: Add subscribe to current auth user user_organization update

    useQeueryHookCallback({
        data,
        error,
        isError,
        isSuccess,
        onSuccess: handleSuccess,
        onError: handleError,
    })

    return null
}

export default AuthLoader
