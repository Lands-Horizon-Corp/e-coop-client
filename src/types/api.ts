export interface IErrorResponse {
    error?: string;
    message?: string;
}

export type KeysOfOrString<T> = (string & {}) | keyof T;

export interface ISortItem<T = unknown> {
    field: KeysOfOrString<T>;
    order: "asc" | "desc";
}

export type TSortingState<T = unknown> = ISortItem<T>[];

// pang API Factory at custom api services na need ng query params
export type TAPIQueryOptions = {
    sort?: string;
    filter?: string;
    pageIndex?: number;
    pageSize?: number;
};

// Pang hook only
export interface IQueryHookOptions<T = unknown> {
    enabled?: boolean;
    initialData?: T;
    showMessage?: boolean;
    retry?: number;
    refetchOnWindowFocus?: boolean;

    buildErrorMessage?:
        | ((args: { errorMessage: string; rawError: Error }) => string)
        | string;

    buildSuccessMessage?: ((args: { data: T }) => string) | string;

    onSuccess?: (data: T) => void;
    onError?: (args: { errorMessage: string; rawError: T }) => void;
}
