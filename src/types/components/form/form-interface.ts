import { IClassProps } from '../commons'

export interface IAuthForm<T, D = unknown> extends IClassProps {
    readOnly?: boolean
    defaultValues?: T
    onSuccess?: (data: D) => void
    onError?: (e: unknown) => void
    onLoading?: (loadingState: boolean) => void
}
