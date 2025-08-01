import qs from 'query-string'

import { downloadFileService } from '@/helpers'

import {
    IFeedback,
    IFeedbackPaginated,
    IFeedbackRequest,
    TEntityId,
} from '@/types'

import APIService from './api-service'

const BASE_ENDPOINT = '/feedback'

export const getFeedbackById = async (id: TEntityId) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/${id}`,
    })

    const response = await APIService.get<IFeedback>(url)
    return response.data
}

export const createFeedback = async (feedbackData: IFeedbackRequest) => {
    const response = await APIService.post<IFeedbackRequest, IFeedback>(
        BASE_ENDPOINT,
        feedbackData
    )
    return response.data
}

export const deleteFeedback = async (id: TEntityId) => {
    const endpoint = `${BASE_ENDPOINT}/${id}`
    await APIService.delete<void>(endpoint)
}

export const getAllFeedback = async (props?: {
    sort?: string
    filters?: string
}) => {
    const { filters, sort } = props || {}

    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/search`,
        query: {
            sort,
            filter: filters,
        },
    })

    const response = await APIService.get<IFeedback[]>(url)
    return response.data
}

export const getPaginatedFeedbacks = async (props?: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/search`,
        query: {
            sort,
            filter: filters,
            pageIndex: pagination?.pageIndex,
            pageSize: pagination?.pageSize,
        },
    })

    const response = await APIService.get<IFeedbackPaginated>(url)
    return response.data
}

export const exportAllFeedbacks = async () => {
    const url = `${BASE_ENDPOINT}/export`
    await downloadFileService(url, 'all_feedbacks_export.csv')
}

export const exportFilteredFeedbacks = async (filters?: string) => {
    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/export-search`,
        query: { filter: filters },
    })

    await downloadFileService(url, 'filtered_feedbacks_export.csv')
}

export const exportSelectedFeedbacks = async (ids: TEntityId[]) => {
    if (ids.length === 0) {
        throw new Error('No feedback IDs provided for export.')
    }

    const url = qs.stringifyUrl({
        url: `${BASE_ENDPOINT}/export-selected`,
        query: { ids },
    })

    await downloadFileService(url, 'selected_feedbacks_export.csv')
}

export const deleteManyFeedbacks = async (ids: TEntityId[]) => {
    const url = `${BASE_ENDPOINT}/bulk-delete`
    const payload = { ids }

    await APIService.delete<void>(url, payload)
}
