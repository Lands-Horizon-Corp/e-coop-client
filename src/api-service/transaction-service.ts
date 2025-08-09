import qs from 'query-string'

import {
    createAPICollectionService,
    createAPICrudService,
} from '@/factory/api-factory-service'

import {
    IGeneralLedger,
    IPaymentQuickRequest,
    IPaymentRequest,
    ITransactionPaginated,
    ITransactionRequest,
    ITransactionResponse,
} from '@/types'

import APIService from './api-service'

const TransactionCrudServices = createAPICrudService<
    ITransactionResponse,
    ITransactionRequest
>('/api/v1/transaction')

const TransactionSearchServices =
    createAPICollectionService<ITransactionResponse>(
        '/api/v1/transaction/search'
    )

const createPaymentTransaction = async (
    data: IPaymentRequest,
    transactionId: string
) => {
    const response = await APIService.post<IPaymentRequest, IGeneralLedger>(
        `/api/v1/transaction/${transactionId}/payment`,
        data
    )
    return response.data
}
const getCurrentPaymentTransaction = async () => {
    const response = await APIService.get<ITransactionResponse[]>(
        `/api/v1/transaction/current`
    )
    return response.data
}

const createQuickTransactionPayment = async ({
    data,
    mode,
}: {
    data: IPaymentQuickRequest
    mode: string
}) => {
    const response = await APIService.post<
        IPaymentQuickRequest,
        IGeneralLedger
    >(`/api/v1/transaction/${mode}`, data)
    return response.data
}
const createTransactionPayment = async (
    transactionId: string,
    data: IPaymentRequest
) => {
    const response = await APIService.post<IPaymentRequest, IGeneralLedger>(
        `/api/v1/transaction/${transactionId}/payment`,
        data
    )
    return response.data
}

const updateReferenceNumber = async (
    transactionId: string,
    reference_number: string,
    description: string
) => {
    const response = await APIService.put<
        { reference_number: string; description: string },
        ITransactionResponse
    >(`/api/v1/transaction/${transactionId}`, {
        reference_number,
        description,
    })
    return response.data
}
export const getPaginatedCurrentTransaction = async ({
    sort,
    filters,
    pagination,
}: {
    sort?: string
    filters?: string
    pagination?: { pageIndex: number; pageSize: number }
}) => {
    const url = qs.stringifyUrl(
        {
            url: `api/v1/transaction/current/search`,
            query: {
                sort,
                filter: filters,
                pageSize: pagination?.pageSize,
                pageIndex: pagination?.pageIndex,
            },
        },
        { skipNull: true }
    )

    const response = await APIService.get<ITransactionPaginated>(url)
    return response.data
}

export const { create, getById, updateById } = TransactionCrudServices

export const { allList: searchTransactions } = TransactionSearchServices

export const TransactionService = {
    ...TransactionCrudServices,
    ...TransactionSearchServices,
    createPaymentTransaction,
    getCurrentPaymentTransaction,
    createQuickTransactionPayment,
    updateReferenceNumber,
    getPaginatedCurrentTransaction,
    createTransactionPayment,
}
