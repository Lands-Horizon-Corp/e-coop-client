import { TSortingState } from '@/hooks/use-sorting-state'

export interface IOperationCallbacks<
    TDataSuccess = unknown,
    TRawError = unknown,
> {
    onSuccess?: (data: TDataSuccess) => void
    onError?: (error: string, rawError?: TRawError) => void
}

export interface IFilterPaginatedHookProps extends IAPIPreloads {
    sort?: TSortingState
    filterPayload?: Record<string, unknown>
    pagination?: { pageIndex: number; pageSize: number }
}

export interface IAPIPreloads {
    preloads?: string[]
}

export interface IQueryProps<T = unknown> {
    enabled?: boolean
    initialData?: T
    showMessage?: boolean
    retry?: number
    refetchOnWindowFocus?: boolean
}

export interface IMutationProps {
    showMessage?: boolean
}

export interface IAPIHook<TData = unknown, TError = unknown>
    extends IOperationCallbacks<TData, TError>,
        IAPIPreloads {}

export interface IAPIFilteredPaginatedHook<TData = unknown, TError = unknown>
    extends IQueryProps,
        IOperationCallbacks<TData, TError>,
        IFilterPaginatedHookProps {}
