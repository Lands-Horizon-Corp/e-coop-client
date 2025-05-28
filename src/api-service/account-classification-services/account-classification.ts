import { TPagination } from '@/hooks/use-pagination'
import { TEntityId, IPaginatedResult } from '@/types'
import {
    IAccountClassification,
    IAccountClassificationPaginatedResource,
    IAccountClassificationRequest,
} from '@/types/coop-types/account-classification'
import APIService from '../api-service'
import qs from 'query-string'

// GET /account-classification/:id
export const getAccountClassificationById = async (id: TEntityId) => {
    const response = await APIService.get<IAccountClassification>(
        `/account-classification/${id}`
    )
    return response.data
}

// GET /account-classification/
export const getAllAccountClassifications = async () => {
    const response = await APIService.get<IAccountClassification[]>(
        `/account-classification`
    )
    return response.data
}

// GET /account-classification/paginated
export const getPaginatedAccountClassifications = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: TPagination
}): Promise<IPaginatedResult<IAccountClassification>> => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/account-classification`,
            query: {
                sort,
                preloads,
                filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response =
        await APIService.get<IAccountClassificationPaginatedResource>(url)
    return response.data
}

// POST /account-classification/account-classification-id
export const createAccountClassification = async (
    accountClassificationData: IAccountClassificationRequest
) => {
    const response = await APIService.post<
        IAccountClassificationRequest,
        IAccountClassification
    >(`/account-classification`, accountClassificationData)
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
    >(`/account-classification/${accountClassificationId}`, data)
    return response.data
}

// DELETE /account-classification/:account_classification_id
export const deleteAccountClassification = async (
    accountClassificationId: TEntityId
) => {
    const response = await APIService.delete<void>(
        `/account-classification/${accountClassificationId}`
    )
    return response.data
}

// DELETE /account-classification/bulk-delete
export const deleteManyAccountClassifications = async (ids: TEntityId[]) => {
    const endpoint = `/account-classification/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
