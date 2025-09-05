import { useEffect } from 'react'

// Since naremove na ang onSuccess, onError from TQ-V4 to TQ-V5, this serves as reusable listender for that
// that the consumer/components can use
export const useQeueryHookCallback = <TData = unknown, TError = unknown>({
    data,
    error,
    isError,
    isSuccess,
    onError,
    onSuccess,
}: {
    error: TError | null
    data?: TData
    isError: boolean
    isSuccess: boolean
    onError?: (error: TError) => void
    onSuccess?: (data: TData) => void
}) => {
    useEffect(() => {
        if (isSuccess && data) onSuccess?.(data)
    }, [isSuccess, data, onSuccess])

    useEffect(() => {
        if (isError && error) onError?.(error)
    }, [isError, error, onError])
}
