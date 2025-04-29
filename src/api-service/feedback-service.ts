import qs from 'query-string'

import APIService from './api-service'
import { downloadFileService } from '@/helpers'

import {
    TEntityId,
    IFeedbackRequest,
    IFeedbackResource,
    IFeedbackPaginatedResource,
} from '@/types'

/**
 * Service class to handle CRUD operations for feedbacks.
 */
export default class FeedbackService {
    private static readonly BASE_ENDPOINT = '/feedback'

    public static async getById(
        id: TEntityId,
        preloads?: string[]
    ): Promise<IFeedbackResource> {
        const url = qs.stringifyUrl({
            url: `${FeedbackService.BASE_ENDPOINT}/${id}`,
            query: { preloads },
        })

        const response = await APIService.get<IFeedbackResource>(url)
        return response.data
    }

    public static async create(
        feedbackData: IFeedbackRequest
    ): Promise<IFeedbackResource> {
        const response = await APIService.post<
            IFeedbackRequest,
            IFeedbackResource
        >(FeedbackService.BASE_ENDPOINT, feedbackData)
        return response.data
    }

    public static async delete(id: TEntityId): Promise<void> {
        const endpoint = `${FeedbackService.BASE_ENDPOINT}/${id}`
        await APIService.delete<void>(endpoint)
    }

    public static async getFeedbacks(props?: {
        sort?: string
        filters?: string
        preloads?: string[]
        pagination?: { pageIndex: number; pageSize: number }
    }): Promise<IFeedbackPaginatedResource> {
        const { filters, preloads, pagination, sort } = props || {}

        const url = qs.stringifyUrl({
            url: `${FeedbackService.BASE_ENDPOINT}`,
            query: {
                sort,
                preloads,
                filter: filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        })

        const response = await APIService.get<IFeedbackPaginatedResource>(url)
        return response.data
    }

    /**
     * Exports all feedbacks.
     *
     * @returns {Promise<void>} - A promise that resolves when the export is complete.
     */
    public static async exportAll(): Promise<void> {
        const url = `${FeedbackService.BASE_ENDPOINT}/export`
        await downloadFileService(url, 'all_feedbacks_export.csv')
    }

    public static async exportAllFiltered(filters?: string): Promise<void> {
        const url = qs.stringifyUrl({
            url: `${FeedbackService.BASE_ENDPOINT}/export-search`,
            query: { filter: filters },
        })

        await downloadFileService(url, 'filtered_feedbacks_export.csv')
    }

    public static async exportSelected(ids: TEntityId[]): Promise<void> {
        if (ids.length === 0) {
            throw new Error('No feedback IDs provided for export.')
        }

        const url = qs.stringifyUrl({
            url: `${FeedbackService.BASE_ENDPOINT}/export-selected`,
            query: { ids },
        })

        await downloadFileService(url, 'selected_feedbacks_export.csv')
    }

    public static async deleteMany(ids: TEntityId[]): Promise<void> {
        const url = `${FeedbackService.BASE_ENDPOINT}/bulk-delete`
        const payload = { ids }

        await APIService.delete<void>(url, payload)
    }
}
