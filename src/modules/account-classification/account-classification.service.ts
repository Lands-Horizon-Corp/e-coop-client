import qs from 'query-string'

import { downloadFile } from '@/helpers/common-helper'
import { createAPIRepository } from '@/providers/repositories/api-crud-factory'
import { createDataLayerFactory } from '@/providers/repositories/data-layer-factory'

import { TEntityId } from '@/types'

import {
    IAccountClassification,
    IAccountClassificationRequest,
} from './account-classification.types'

const { apiCrudHooks } = createDataLayerFactory<
    IAccountClassification,
    IAccountClassificationRequest
>({
    url: '/api/v1/account-classification',
    baseKey: 'account-classification',
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
    IAccountClassification,
    IAccountClassificationRequest
>('/api/v1/account-classification')
export const deleteMany = async (ids: TEntityId[]) => {
    const endpoint = `${route}/bulk-delete`
    await API.delete<void>(endpoint, { ids })
}

export const exportAll = async () => {
    const url = `${route}/export`
    await downloadFile(url, 'all_account-classification_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `${route}/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_account-classification_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `${route}/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFile(url, 'selected_account-classification_export.xlsx')
}
