import { Path } from 'react-hook-form'
import { IClassProps } from '@/types'

export * from './form-interface'

export interface IForm<TDefaultVals, IData = unknown, IErr = unknown>
    extends IClassProps {
    readOnly?: boolean
    defaultValues?: TDefaultVals
    onSuccess?: (data: IData) => void
    onError?: (e: IErr) => void
    onLoading?: (loadingState: boolean) => void
    onSubmit?: (formDatas: Required<TDefaultVals>) => void
    hiddenFields?: Array<Path<TDefaultVals>>
    disabledFields?: Array<Path<TDefaultVals>>
}
