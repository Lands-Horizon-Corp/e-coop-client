import { useEffect } from "react";

export const useQeueryHookCallback = <TData = unknown, TError = unknown>({
    data,
    error,
    isError,
    isSuccess,
    onError,
    onSuccess,
}: {
    error: TError;
    data: TData;
    isError?: boolean;
    isSuccess?: boolean;
    onError?: (error: TError) => void;
    onSuccess?: (data: TData) => void;
}) => {
    useEffect(() => {
        if (isSuccess) onSuccess?.(data);
    }, [isSuccess, data, onSuccess]);

    useEffect(() => {
        if (isError) onError?.(error);
    }, [isError, error, onError]);
};
