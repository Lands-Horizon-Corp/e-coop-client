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
    error: TError | null // Allow null for error
    data?: TData // Made data optional to handle undefined cases
    isError?: boolean
    isSuccess?: boolean
    onError?: (error: TError) => void
    onSuccess?: (data: TData) => void
}) => {
    useEffect(() => {
        console.log('Succcess', isSuccess, data, onSuccess)
        if (isSuccess && data) onSuccess?.(data) // Added a check for data
    }, [isSuccess, data, onSuccess])

    useEffect(() => {
        console.log('Error', isError, error, onError)
        if (isError && error) onError?.(error) // Added a check for error
    }, [isError, error, onError])
}
