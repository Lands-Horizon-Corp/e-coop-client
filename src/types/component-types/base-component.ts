import type { ReactNode } from 'react'

/* Component Props with child and className */
export interface IBaseProps {
    children?: ReactNode
    className?: string
}

/* Component Props with only className */
export interface IClassProps {
    className?: string
}

/* Component Props with only child*/
export interface IChildProps {
    children?: ReactNode
}

/* For components that has generic onSuccess and onError */
export interface IOperationCallback<TData = unknown, TError = Error> {
    onSuccess?: (data: TData) => void
    onError?: (error: TError) => void
}
