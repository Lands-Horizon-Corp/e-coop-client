import { AxiosError } from 'axios'

import { axiosErrorMessageExtractor } from '@/helpers/axios-helpers/axios-error-extractor'
import { IErrorResponse } from '@/types/api'

import { TErrorMessageExtractor } from '.'

// AxiosError's constructor signature is not compatible with the generic
// `new (...args: unknown[]) => Error` type, so cast it to satisfy TS.
export const axiosErrExtractor: TErrorMessageExtractor = [
    AxiosError as unknown as new (...args: unknown[]) => Error,
    (err: Error) =>
        axiosErrorMessageExtractor(err as AxiosError<IErrorResponse>),
]
