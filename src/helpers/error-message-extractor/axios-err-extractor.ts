import { axiosErrorMessageExtractor } from '@/helpers/axios-error-extractor'
import { IErrorResponse } from '@/types/api'
import { AxiosError } from 'axios'

import { TErrorMessageExtractor } from '.'

export const axiosErrExtractor: TErrorMessageExtractor = [
    AxiosError<IErrorResponse>,
    (err: Error) =>
        axiosErrorMessageExtractor(err as AxiosError<IErrorResponse>),
]
