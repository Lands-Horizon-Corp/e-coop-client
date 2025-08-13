import qs from 'query-string'

import {
    IAccountClassification,
    IAccountClassificationPaginated,
    IAccountClassificationRequest,
} from '@/types/coop-types/account-classification'

import { TPagination } from '@/hooks/use-pagination'

import { IPaginatedResult, TEntityId } from '@/types'

import APIService from '../api-service'

// GET /account-classification/:id
export const getAccountClassificationById = async (id: TEntityId) => {
    const response = await APIService.get<IAccountClassification>(
        `/api/v1/account-classification/${id}`
    )
    return response.data
}

// GET /account-classification/
export const getAllAccountClassifications = async () => {
    const response = await APIService.get<IAccountClassification[]>(
        `/api/v1/account-classification`
    )
    return response.data
}

// GET /account-classification/paginated
export const getPaginatedAccountClassifications = async (props?: {
    sort?: string
    filters?: string
    pagination?: TPagination
}): Promise<IPaginatedResult<IAccountClassification>> => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/account-classification/search`,
            query: {
                sort,
                filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IAccountClassificationPaginated>(url)
    return response.data
}

// POST /account-classification/account-classification-id
export const createAccountClassification = async (
    accountClassificationData: IAccountClassificationRequest
) => {
    const response = await APIService.post<
        IAccountClassificationRequest,
        IAccountClassification
    >(`/api/v1/account-classification`, accountClassificationData)
    return response.data
}

// PUT /account-classification/:account_classification_id
export const updateAccountClassification = async (
    accountClassificationId: TEntityId,
    data: IAccountClassificationRequest
) => {
    const response = await APIService.put<
        IAccountClassificationRequest,
        IAccountClassification
    >(`/api/v1/account-classification/${accountClassificationId}`, data)
    return response.data
}

// DELETE /account-classification/:account_classification_id
export const deleteAccountClassification = async (
    accountClassificationId: TEntityId
) => {
    const response = await APIService.delete<void>(
        `/api/v1/account-classification/${accountClassificationId}`
    )
    return response.data
}

// DELETE /account-classification/bulk-delete
export const deleteManyAccountClassifications = async (ids: TEntityId[]) => {
    const endpoint = `/api/v1/account-classification/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
