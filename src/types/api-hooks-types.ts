import { QueryClient } from '@tanstack/react-query'

import { TSortingState } from '@/hooks/use-sorting-state'

export interface IOperationCallbacks<
    TDataSuccess = unknown,
    TRawError = unknown,
> {
    onSuccess?: (data: TDataSuccess) => void
    onError?: (error: string, rawError?: TRawError) => void
}

export interface IFilteredSortedHookProps {
    sort?: TSortingState
    filterPayload?: Record<string, unknown>
}

export interface IFilterPaginatedHookProps extends IFilteredSortedHookProps {
    pagination?: { pageIndex: number; pageSize: number }
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
    extends IOperationCallbacks<TData, TError> {}

export interface IAPIFilteredPaginatedHook<TData = unknown, TError = unknown>
    extends IQueryProps<TData>,
        IOperationCallbacks<TData, TError>,
        IFilterPaginatedHookProps {}

export interface IAPIFilteredHook<TData = unknown, TError = unknown>
    extends IQueryProps<TData>,
        IOperationCallbacks<TData, TError>,
        IFilteredSortedHookProps {}

export interface IInvalidateFnArgs<TData = unknown, TVariables = unknown> {
    queryClient: QueryClient
    payload: TVariables
    resultData: TData
}
