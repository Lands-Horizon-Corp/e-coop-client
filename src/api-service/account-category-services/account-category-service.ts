import { TPagination } from '@/hooks/use-pagination'
import { TEntityId, IPaginatedResult } from '@/types'
import {
    IAccountCategory,
    IAccountCategoryPaginatedResource,
    IAccountCategoryRequest,
} from '@/types/coop-types/account-category'

import APIService from '../api-service'
import qs from 'query-string'

// GET /account-category/:id
export const getAccountCategoryById = async (id: TEntityId) => {
    const response = await APIService.get<IAccountCategory>(
        `/account-category/${id}`
    )
    return response.data
}

// GET /account-category/
export const getAllAccountCategories = async () => {
    const response =
        await APIService.get<IAccountCategory[]>(`/account-category`)
    return response.data
}

// GET /account-category/paginated
export const getPaginatedAccountCategories = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: TPagination
}): Promise<IPaginatedResult<IAccountCategory>> => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/account-category`,
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
        await APIService.get<IAccountCategoryPaginatedResource>(url)
    return response.data
}

// POST /account-category/
export const createAccountCategory = async (
    accountCategoryData: IAccountCategoryRequest
) => {
    const response = await APIService.post<
        IAccountCategoryRequest,
        IAccountCategory
    >(`/account-category`, accountCategoryData)
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
    >(`/account-category/${accountCategoryId}`, data)
    return response.data
}

// DELETE /account-category/:account_category_id
export const deleteAccountCategory = async (accountCategoryId: TEntityId) => {
    const response = await APIService.delete<void>(
        `/account-category/${accountCategoryId}`
    )
    return response.data
}

// DELETE /account-category/bulk-delete
export const deleteManyAccountCategories = async (ids: TEntityId[]) => {
    const endpoint = `/account-category/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
