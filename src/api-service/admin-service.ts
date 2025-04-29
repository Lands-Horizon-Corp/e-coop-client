import qs from 'query-string'

import APIService from './api-service'
import { downloadFileService } from '@/helpers'

import { IUserBase, IAdmin, TEntityId } from '@/types'

/**
 * Service class to handle CRUD operations for admins.
 */
export default class AdminService {
    private static readonly BASE_ENDPOINT = '/admin'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IAdmin> {
        const url = qs.stringifyUrl({
            url: `${AdminService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IAdmin>(url)
        return response.data
    }

    public static async create(adminData: IUserBase): Promise<IAdmin> {
        const response = await APIService.post<IUserBase, IAdmin>(
            AdminService.BASE_ENDPOINT,
            adminData
        )
        return response.data
    }

    public static async update(
        id: TEntityId,
        adminData: IUserBase,
        preloads?: string[]
    ): Promise<IAdmin> {
        const url = qs.stringifyUrl(
            {
                url: `${AdminService.BASE_ENDPOINT}/${id}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        const response = await APIService.put<IUserBase, IAdmin>(url, adminData)
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${AdminService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async getAdmins(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IAdmin[]> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${AdminService.BASE_ENDPOINT}`,
                query: {
                    sort,
                    preloads,
                    filter: filters,
                    pageIndex: pagination?.pageIndex,
                    pageSize: pagination?.pageSize,
                },
            },
            { skipNull: true }
        )

        const response = await APIService.get<IAdmin[]>(url)
        return response.data
    }

    public static async verify(id: TEntityId): Promise<IAdmin> {
        const endpoint = `${AdminService.BASE_ENDPOINT}/verify/${id}`
        const response = await APIService.post<void, IAdmin>(endpoint)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${AdminService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_admins_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No admin IDs provided for export.')
        }

        const url = qs.stringifyUrl({
            url: `${AdminService.BASE_ENDPOINT}/export-selected`,
            query: { ids },
        })

        await downloadFileService(url, 'selected_admins_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const url = `${AdminService.BASE_ENDPOINT}/bulk-delete`
        const payload = { ids }

        await APIService.delete<void>(url, payload)
    }
}
