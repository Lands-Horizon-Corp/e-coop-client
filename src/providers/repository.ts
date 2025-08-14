import qs from "query-string";
import { TEntityId } from "@/data-layer/common";
import API from "./api";
import { useQuery } from "@tanstack/react-query";
import { withCatchAsync } from "@/helpers/function-utils";
import { serverRequestErrExtractor } from "@/helpers/error-message-extractor";
import { IQueryHookOptions, TAPIQueryOptions } from "@/types/api";
import { toast } from "sonner";

export class Repository<TResponse, TRequest> extends API {
    route: string;

    constructor(route: string) {
        super();
        this.route = route;
    }

    async create(payload: TRequest) {
        const response = await API.post<TRequest, TResponse>(
            this.route,
            payload
        );
        return response.data;
    }

    async updateById<TUpdateData = TResponse, TUpdatePayload = TRequest>(
        id: TEntityId,
        payload: TUpdatePayload
    ) {
        const response = await API.put<TUpdatePayload, TUpdateData>(
            `${this.route}/${id}`,
            payload
        );
        return response.data;
    }

    async getById<TGeTResponseResponse = TResponse>(id: TEntityId) {
        const response = await API.get<TGeTResponseResponse>(
            `${this.route}/${id}`
        );
        return response.data;
    }

    async deleteById<TDeleteData = TResponse>(id: TEntityId) {
        await API.delete<TDeleteData>(`${this.route}/${id}`);
    }

    async deleteMany(ids: TEntityId[]) {
        await API.delete(`${this.route}/bulk-delete`, { ids });
    }

    async getAll(
        query: {
            url?: string;
        } & TAPIQueryOptions = {}
    ) {
        const url = qs.stringifyUrl({
            url: `${this.route}/`,
            query: query,
        });
        const response = await API.get<TResponse[]>(url);
        return response.data;
    }

    async getPaginated(
        query?: {
            url?: string;
        } & TAPIQueryOptions
    ) {
        const url = qs.stringifyUrl(
            {
                url: query?.url || `${this.route}/search`,
                query,
            },
            { skipNull: true }
        );

        const response = await API.get<{
            data: TResponse[];
            pageIndex: number;
            totalPage: number;
            pageSize: number;
            totalSize: number;
        }>(url);
        return response.data;
    }
}

export class DataLayerFactory<TResponse, TRequest> extends Repository<
    TResponse,
    TRequest
> {
    baseKey: string;

    constructor(route: string, baseKey: string) {
        super(route);
        this.baseKey = baseKey;
    }

    useGetAll(
        {
            showMessage,
            buildErrorMessage,
            buildSuccessMessage,
            onError,
            onSuccess,
            enabled,
            refetchOnWindowFocus,
            retry,
            initialData,
            ...query
        }: IQueryHookOptions<TResponse[]> & TAPIQueryOptions = {
            showMessage: true,
            buildErrorMessage: "Something went wrong",
        }
    ) {
        return useQuery<TResponse[], string>({
            queryKey: [this.baseKey, "all", query],
            queryFn: async () => {
                const [error, result] = await withCatchAsync(
                    this.getAll(query)
                );

                if (error) {
                    const errorMessage = serverRequestErrExtractor({ error });

                    if (showMessage) {
                        toast.error(
                            typeof buildErrorMessage === "function"
                                ? buildErrorMessage({
                                      errorMessage,
                                      rawError: error,
                                  })
                                : buildErrorMessage || errorMessage
                        );
                        console.log("toast");
                    }
                    // onError?.(errorMessage, error as TError);
                    throw errorMessage;
                }

                // if (query.showMessage)
                //     toast.success(successMessage || "Loaded");
                // onSuccess?.(result);
                // invalidateFn?.({
                //     queryClient,
                //     payload: variables,
                //     resultData: result,
                // });
                return result;
            },
            retry,
            initialData,
            refetchOnWindowFocus,
        });
    }
}

// ['bank', 'branch', {sort, filter, pageIndex : 0, pageSize }] : [{...}]
// ['bank', 'all', {sort, filter, pageIndex : 0, pageSize }] : [{...}]
// ['bank', 'all', {sort, filter, pageIndex : 1, pageSize }] : [{...}, {...}]

// query.invalidateQueries({
//     queryKey : ['bank'],
//     exact : true
// })
