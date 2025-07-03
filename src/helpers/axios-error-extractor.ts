import { isObjectEmpty } from '@/utils'
import { AxiosError } from 'axios'

export const axiosErrorMessageExtractor = (
    error: AxiosError<{ message?: string; error?: string }>
): string => {
    if (!error.response) {
        if (!error.response) {
            if (
                error.code === 'ECONNREFUSED' ||
                error.message.includes('Network Error')
            ) {
                return 'Network error. Connection refused. Please check if the server is running and accessible.'
            }
            if (error.message.includes('ERR_EMPTY_RESPONSE')) {
                return 'The server did not send any data. Please check the server status.'
            }
            return 'Network error. Please check your connection.'
        }
    }
    const { response } = error

    // Former isObjectEmpty(response)
    if (isObjectEmpty(response.data)) return 'Unknown server error occured'

    switch (response.status) {
        case 404:
            return 'Sorry, the requested resource is not found'
        case 500:
            return 'Sorry, the server encountered an error'
        default:
            return (
                response.data?.message ||
                response.data?.error ||
                'An error occurred. Please try again'
            )
    }
}
