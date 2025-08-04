import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import { IBank, IBankRequest, TEntityId } from '@/types'

import { downloadFile } from '../helpers'

const CrudServices = createAPICrudService<IBank, IBankRequest>('/bank')
const CollectionServices = createAPICollectionService<IBank>('/bank')

export const { create, getById, updateById, deleteById, deleteMany } =
    CrudServices
export const { search, allList } = CollectionServices

export const exportAll = async () => {
    const url = `/api/v1/bank/export`
    await downloadFile(url, 'all_banks_export.xlsx')
}

export const exportAllFiltered = async (filters?: string) => {
    const url = `/api/v1/bank/export-search?filter=${filters || ''}`
    await downloadFile(url, 'filtered_banks_export.xlsx')
}

export const exportSelected = async (ids: TEntityId[]) => {
    const url = qs.stringifyUrl(
        {
            url: `/api/v1/bank/export-selected`,
            query: { ids },
        },
        { skipNull: true }
    )

    await downloadFile(url, 'selected_banks_export.xlsx')
}

export default {
    ...CrudServices,
    ...CollectionServices,
    exportAll,
    exportSelected,
    exportAllFiltered,
}
