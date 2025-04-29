import { AxiosError } from 'axios'

import { TErrorMessageExtractor } from '.'
import { IErrorResponse } from '@/types/coop-types'
import { axiosErrorMessageExtractor } from '@/helpers/axios-error-extractor'

export const axiosErrExtractor: TErrorMessageExtractor = [
    AxiosError<IErrorResponse>,
    (err: Error) =>
        axiosErrorMessageExtractor(err as AxiosError<IErrorResponse>),
]
