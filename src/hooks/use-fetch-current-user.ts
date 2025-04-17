import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'

import { withCatchAsync } from '@/utils'
import { IUserData } from '@/server/types'
import { useUserAuthStore } from '@/store/user-auth-store'
import AuthService from '@/server/api-service/auth-service'

const useFetchCurrentUser = (options?: {
    onUnauthorized?: () => void
    onError?: (error: unknown) => void
    onSuccess?: (userData: IUserData) => void
    retry?: number
    refetchOnWindowFocus?: boolean
}) => {
    const { currentUser, setAuthStatus, setCurrentUser } = useUserAuthStore()

    const query = useQuery<IUserData | null>({
        queryKey: ['current-user'],
        queryFn: async () => {
            if (!currentUser) setAuthStatus('loading')

            const [error, response] = await withCatchAsync(
                AuthService.currentUser()
            )

            if (error) {
                if (error instanceof AxiosError && error.status === 401) {
                    options?.onUnauthorized?.()
                    setCurrentUser(null)
                    setAuthStatus('unauthorized')
                    return null
                }

                if (error instanceof AxiosError && error.status === 500) {
                    options?.onError?.(error)
                    setAuthStatus('error')
                    return null
                }

                options?.onError?.(error)
                throw error
            }

            const userData = response
            setCurrentUser(userData)
            setAuthStatus('authorized')
            options?.onSuccess?.(userData)
            return userData
        },
        refetchOnWindowFocus: options?.refetchOnWindowFocus,
        retry: options?.retry ?? 0,
    })

    return { query }
}

export default useFetchCurrentUser
