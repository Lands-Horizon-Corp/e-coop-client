import { TEntityId } from "@/data-layer/common";
import API from "./api";

export class Repository<TResponse, TRequest> {
    route: string;

    constructor(route: string) {
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
}

export class Hook<TResponse, TRequest> extends Repository<TResponse, TRequest> {
    constructor(route: string, key: string[]) {
        super(route);
    }
}
