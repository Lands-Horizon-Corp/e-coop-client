import APIService from './api-service'
import { IRoles, IRolesRequest, TEntityId } from '@/types'

/**
 * Service class to handle CRUD operations for roles.
 */
export default class RoleService {
    private static readonly BASE_ENDPOINT = '/role'

    public static async getAll(): Promise<IRoles[]> {
        const response = await APIService.get<IRoles[]>(
            RoleService.BASE_ENDPOINT
        )
        return response.data
    }

    public static async create(roleData: IRolesRequest): Promise<IRoles> {
        const response = await APIService.post<IRolesRequest, IRoles>(
            RoleService.BASE_ENDPOINT,
            roleData
        )
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${RoleService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        roleData: IRolesRequest
    ): Promise<IRoles> {
        const endpoint = `${RoleService.BASE_ENDPOINT}/${id}`
        const response = await APIService.put<IRolesRequest, IRoles>(
            endpoint,
            roleData
        )
        return response.data
    }

    public static async getById(id: TEntityId): Promise<IRoles> {
        const endpoint = `${RoleService.BASE_ENDPOINT}/${id}`
        const response = await APIService.get<IRoles>(endpoint)
        return response.data
    }
}
