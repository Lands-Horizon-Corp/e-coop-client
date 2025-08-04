import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'
import { ITransaction } from '@/types/coop-types/transaction'

import { IMemberAccountingLedger, TEntityId } from '@/types'

import APIService from './api-service'

export const getAllTransactions = async (): Promise<ITransaction[]> => {
    const response = await APIService.get<ITransaction[]>('/api/v1/transaction')
    return response.data
}

export const getMemberAccountingLedger = async (memberProfileId: TEntityId) => {
    const url = qs.stringifyUrl({
        url: `/api/v1/transaction/member-profile/${memberProfileId}`,
    })

    const response = await APIService.get<IMemberAccountingLedger>(url)
    return response.data
}

const { deleteMany, deleteById, getById } = createAPICrudService<
    ITransaction,
    void
>('/api/v1/transaction')

const CollectionServices = createAPICollectionService<ITransaction>(
    '/api/v1/transaction'
)

export const { search } = CollectionServices
export default {
    ...CollectionServices,
    search,
    getById,
    deleteMany,
    deleteById,
    getAllTransactions,
    getMemberAccountingLedger,
}
