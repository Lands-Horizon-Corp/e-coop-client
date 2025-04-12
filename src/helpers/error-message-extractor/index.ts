import { zodErrExtractor } from './zod-err-extractor'
import { axiosErrExtractor } from './axios-err-extractor'

export type TErrorMessageExtractor = [
    new (...args: any[]) => Error, // Error, AxiosError, or any other error
    (error: Error) => string,
]

type TErrorMessageExtractors = Array<TErrorMessageExtractor>

type TExtractErrorMessageParams = {
    error: unknown
    errorMessageExtractors?: TErrorMessageExtractors
    showUnknownErrorMessage?: boolean
}

export const extractErrorMessage = ({
    error,
    errorMessageExtractors,
    showUnknownErrorMessage = false,
}: TExtractErrorMessageParams) => {
    if (errorMessageExtractors) {
        for (const [ErrorType, extractor] of errorMessageExtractors) {
            if (error instanceof ErrorType) {
                return extractor(error)
            }
        }
    }
    return showUnknownErrorMessage
        ? ((error as Error)?.message ?? 'An unknown error occured')
        : 'An unknown error occured'
}

/**
 * This handles all possible errors you may have and returns the error message depending on what
 * error instanced match the error message extractor
 * @returns {string}
 */
export const allErrorMessageExtractor = ({
    errorMessageExtractors = [
        zodErrExtractor,
        axiosErrExtractor,
        // add your own error extractor here
    ],
    ...other
}: TExtractErrorMessageParams): any => {
    // Error, AxiosError, or any other error
    return extractErrorMessage({ ...other, errorMessageExtractors })
}

/**
 * Since Horizon Server utilize axios, it will throw an AxiosError when an error is encountered,
 * this function returns error message
 * @returns {string}
 */
export const serverRequestErrExtractor = ({
    error,
}: {
    error: unknown
}): string => {
    return extractErrorMessage({
        error,
        errorMessageExtractors: [axiosErrExtractor],
    })
}
