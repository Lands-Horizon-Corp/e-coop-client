// services/MemberService.ts
import qs from 'query-string'

import APIService from '../api-service'
import { downloadFileService } from '@/helpers'

import {
    IMedia,
    IMember,
    TEntityId,
    IMediaRequest,
    IMemberRequest,
    IMemberPaginatedResource,
} from '@/types'

export default class MemberService {
    private static readonly BASE_ENDPOINT = '/member'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IMember> {
        const url = qs.stringifyUrl({
            url: `${MemberService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IMember>(url, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`, // Replace with actual token if needed
            },
        })

        return response.data
    }

    public static async getMedias(id: TEntityId) {
        const response = await APIService.get<IMedia[]>(
            `${this.BASE_ENDPOINT}/${id}/medias`
        )
        return response.data
    }

    public static async create(data: IMemberRequest, preloads?: string[]) {
        const url = qs.stringifyUrl(
            {
                url: `${MemberService.BASE_ENDPOINT}`,
                query: { preloads },
            },
            { skipNull: true }
        )

        return (await APIService.post<IMemberRequest, IMember>(url, data)).data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${MemberService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async update(
        id: TEntityId,
        memberData:
            | IMemberRequest
            | (Omit<IMemberRequest, 'password' | 'confirmPassword'> & {
                  password?: string
                  confirmPassword?: string
              }),
        preloads?: string[]
    ): Promise<IMember> {
        const url = qs.stringifyUrl({
            url: `${MemberService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.put<
            | IMemberRequest
            | (Omit<IMemberRequest, 'password' | 'confirmPassword'> & {
                  password?: string
                  confirmPassword?: string
              }),
            IMember
        >(url, memberData, {
            headers: {
                Authorization: `Bearer YOUR_TOKEN`, // Replace with actual token if needed
            },
        })
        return response.data
    }

    public static async getMembers(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IMemberPaginatedResource> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${MemberService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<IMemberPaginatedResource>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${MemberService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_members_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const filterQuery = filters
            ? `filter=${encodeURIComponent(filters)}`
            : ''
        const url = `${MemberService.BASE_ENDPOINT}/export-search${filterQuery ? `?${filterQuery}` : ''}`
        await downloadFileService(url, 'filtered_members_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No member IDs provided for export.')
        }
        const url = qs.stringifyUrl(
            {
                url: `${MemberService.BASE_ENDPOINT}/export-selected`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFileService(url, 'selected_members_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const endpoint = `${MemberService.BASE_ENDPOINT}/bulk-delete`

        const payload = { ids }

        await APIService.delete<void>(endpoint, payload)
    }

    public static async profilePicture(
        id: TEntityId,
        data: IMediaRequest,
        preloads: string[] = ['Media']
    ): Promise<IMember> {
        const preloadParams =
            preloads
                ?.map((preload) => `preloads=${encodeURIComponent(preload)}`)
                .join('&') || ''
        const separator = preloadParams ? '?' : ''
        const endpoint = `${MemberService.BASE_ENDPOINT}/profile-picture/${id}${separator}${preloadParams}`
        const response = await APIService.post<IMediaRequest, IMember>(
            endpoint,
            data
        )
        return response.data
    }
}
