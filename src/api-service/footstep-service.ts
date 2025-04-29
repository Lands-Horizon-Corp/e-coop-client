import qs from 'query-string'

import APIService from './api-service'
import { downloadFileService } from '@/helpers'

import { IFootstepPaginated, TEntityId } from '@/types'

/**
 * Service class to handle CRUD operations for footsteps.
 */
export default class FootstepService {
    private static readonly BASE_ENDPOINT = '/footstep'

    // GET Details of specific footsteps
    public static async getFootstepById(
        footstepId: TEntityId,
        preloads: string[] = [
            'Admin',
            'Admin.Media',
            'Employee',
            'Employee.Media',
            'Owner',
            'Owner.Media',
            'Member',
            'Member.Media',
        ]
    ) {
        const url = qs.stringifyUrl(
            {
                url: `${FootstepService.BASE_ENDPOINT}/${footstepId}`,
                query: {
                    preloads,
                },
            },
            { skipNull: true }
        )
        const response = await APIService.get<IFootstepPaginated>(url)
        return response.data
    }

    public static async exportAll(): Promise<void> {
        const url = `${FootstepService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_footsteps_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const filterQuery = filters
            ? `filter=${encodeURIComponent(filters)}`
            : ''
        const url = `${FootstepService.BASE_ENDPOINT}/export-search${filterQuery ? `?${filterQuery}` : ''}`
        await downloadFileService(url, 'filtered_footsteps_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No footstep IDs provided for export.')
        }

        const url = qs.stringifyUrl(
            {
                url: `${FootstepService.BASE_ENDPOINT}/export-selected?`,
                query: { ids },
            },
            { skipNull: true }
        )

        await downloadFileService(url, 'selected_footsteps_export.csv')
    }

    // Retrieve footsteps[] for a team based on the user role:
    //   - Admin: Can retrieve footsteps for all members, employees, and owners across all branches.
    //   - Owner: Can retrieve footsteps for employees and members within their owned branches.
    //   - Employee: Can retrieve footsteps for employees and members within their specific branch.
    public static async getFootstepsTeam(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IFootstepPaginated> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${FootstepService.BASE_ENDPOINT}/team`,
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

        const response = await APIService.get<IFootstepPaginated>(url)
        return response.data
    }

    // GET only your own footsteps[]
    public static async getFootsteps(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IFootstepPaginated> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl(
            {
                url: `${FootstepService.BASE_ENDPOINT}`,
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

        const response = await APIService.get<IFootstepPaginated>(url)
        return response.data
    }
}
