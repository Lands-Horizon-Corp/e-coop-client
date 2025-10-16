import qs from 'query-string'

import { downloadFile } from '@/helpers/common-helper'
import { Logger } from '@/helpers/loggers'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import {
    IAccountCategory,
    IAccountCategoryRequest,
} from './account-category.types'

const { apiCrudHooks } = createDataLayerFactory<
    IAccountCategory,
    IAccountCategoryRequest
>({
    url: '/api/v1/account-category',
    baseKey: 'account-category',
})

export const {
    useCreate,
    useGetAll,
    useGetById,
    useDeleteById,
    useUpdateById,
    useGetPaginated,
} = apiCrudHooks

const { API, route } = createAPIRepository<
    IAccountCategory,
    IAccountCategoryRequest
>('/api/v1/account-category')
export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${route}/bulk-delete`
    await API.delete<void>(endpoint, { ids })
}

export const exportAll = async () => {
    const url = `${route}/export`
    await downloadFile(url, 'all_banks_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${route}/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_account_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${route}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFile(url, 'selected_banks_export.xlsx')
}

export const logger = Logger.getInstance('account-category')
