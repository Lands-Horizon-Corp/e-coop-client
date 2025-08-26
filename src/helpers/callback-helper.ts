import { toast } from 'sonner'

type ToastCallbackMiddleware<TData, TError> = {
    textSuccess?: ((data: TData) => string) | string
    textError?: ((error: TError) => string) | string
    onSuccess?: (data: TData) => void
    onError?: (error: TError) => void
}

export const withToastCallbacks = <TData, TError>({
    textSuccess = 'Success',
    textError = 'Failed',
    onSuccess,
    onError,
}: ToastCallbackMiddleware<TData, TError>) => {
    return {
        onSuccess: (data: TData) => {
            const successMessage =
                typeof textSuccess === 'function' ? textSuccess(data) : textSuccess
            toast.success(successMessage)
            onSuccess?.(data)
        },
        onError: (error: TError) => {
            const errorMessage =
                typeof textError === 'function' ? textError(error) : textError
            toast.error(errorMessage)
            onError?.(error)
        },
    }
}
