import qs from 'query-string'

import {
    IAccountCategory,
    IAccountCategoryPaginated,
    IAccountCategoryRequest,
} from '@/types/coop-types/account-category'

import { TPagination } from '@/hooks/use-pagination'

import { IPaginatedResult, TEntityId } from '@/types'

import APIService from '../api-service'

// GET /account-category/:id
export const getAccountCategoryById = async (id: TEntityId) => {
    const response = await APIService.get<IAccountCategory>(
        `/api/v1/account-category/${id}`
    )
    return response.data
}

// GET /account-category/
export const getAllAccountCategories = async () => {
    const response = await APIService.get<IAccountCategory[]>(
        `/api/v1/account-category`
    )
    return response.data
}

// GET /account-category/search
export const getPaginatedAccountCategories = async (props?: {
    sort?: string
    filters?: string
    pagination?: TPagination
}): Promise<IPaginatedResult<IAccountCategory>> => {
    const { filters, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/api/v1/account-category/search`,
            query: {
                sort,
                filters,
                pageIndex: pagination?.pageIndex,
                pageSize: pagination?.pageSize,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<IAccountCategoryPaginated>(url)
    return response.data
}

// POST /account-category/
export const createAccountCategory = async (
    accountCategoryData: IAccountCategoryRequest
) => {
    const response = await APIService.post<
        IAccountCategoryRequest,
        IAccountCategory
    >(`/api/v1/account-category`, accountCategoryData)
    return response.data
}

// PUT /account-category/:account_category_id
export const updateAccountCategory = async (
    accountCategoryId: TEntityId,
    data: IAccountCategoryRequest
) => {
    const response = await APIService.put<
        IAccountCategoryRequest,
        IAccountCategory
    >(`/api/v1/account-category/${accountCategoryId}`, data)
    return response.data
}

// DELETE /account-category/:account_category_id
export const deleteAccountCategory = async (accountCategoryId: TEntityId) => {
    const response = await APIService.delete<void>(
        `/api/v1/account-category/${accountCategoryId}`
    )
    return response.data
}

// DELETE /account-category/bulk-delete
export const deleteManyAccountCategories = async (ids: TEntityId[]) => {
    const endpoint = `/api/v1/account-category/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
