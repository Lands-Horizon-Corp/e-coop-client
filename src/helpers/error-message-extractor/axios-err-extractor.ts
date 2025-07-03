import { axiosErrorMessageExtractor } from '@/helpers/axios-error-extractor'
import { AxiosError } from 'axios'

import { IErrorResponse } from '@/types'

import { TErrorMessageExtractor } from '.'

export const axiosErrExtractor: TErrorMessageExtractor = [
    AxiosError<IErrorResponse>,
    (err: Error) =>
        axiosErrorMessageExtractor(err as AxiosError<IErrorResponse>),
]
