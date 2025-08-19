import { Path } from 'react-hook-form'

import { IClassProps } from '@/types'

export interface IForm<
    TDefaultVals,
    IData = unknown,
    IErr = unknown,
    THidisable = TDefaultVals,
> extends IClassProps {
    readOnly?: boolean
    defaultValues?: TDefaultVals
    resetOnDefaultChange?: boolean
    hiddenFields?: Array<Path<THidisable>>
    disabledFields?: Array<Path<THidisable>>
    onSuccess?: (data: IData) => void
    onError?: (e: IErr) => void
    onLoading?: (loadingState: boolean) => void
    onSubmit?: (formDatas: Required<TDefaultVals>) => void
}
