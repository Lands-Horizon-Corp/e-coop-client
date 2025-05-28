import { TPagination } from '@/hooks/use-pagination'

import { TEntityId, IPaginatedResult } from '@/types'
import {
    IPaymentType,
    IPaymentTypePaginatedResource,
    IPaymentTypeRequest,
} from '@/types/coop-types/payment-type'

import qs from 'query-string'
import APIService from '../api-service'

// GET /payment-type/:id
export const getPaymentTypeById = async (id: TEntityId) => {
    const response = await APIService.get<IPaymentType>(`/payment-type/${id}`)
    return response.data
}

// GET /payment-type/
export const getAllPaymentTypes = async () => {
    const response = await APIService.get<IPaymentType[]>(`/payment-type`)
    return response.data
}

// GET /payment-type/paginated
export const getPaginatedPaymentTypes = async (props?: {
    sort?: string
    filters?: string
    preloads?: string[]
    pagination?: TPagination
}): Promise<IPaginatedResult<IPaymentType>> => {
    const { filters, preloads, pagination, sort } = props || {}

    const url = qs.stringifyUrl(
        {
            url: `/payment-type`,
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

    const response = await APIService.get<IPaymentTypePaginatedResource>(url)
    return response.data
}

// POST /payment-type/
export const createPaymentType = async (
    paymentTypeData: IPaymentTypeRequest
) => {
    const response = await APIService.post<IPaymentTypeRequest, IPaymentType>(
        `/payment-type`,
        paymentTypeData
    )
    return response.data
}

// PUT /payment-type/:payment_type_id
export const updatePaymentType = async (
    paymentTypeId: TEntityId,
    data: IPaymentTypeRequest
) => {
    const response = await APIService.put<IPaymentTypeRequest, IPaymentType>(
        `/payment-type/${paymentTypeId}`,
        data
    )
    return response.data
}

// DELETE /payment-type/:payment_type_id
export const deletePaymentType = async (paymentTypeId: TEntityId) => {
    const response = await APIService.delete<void>(
        `/payment-type/${paymentTypeId}`
    )
    return response.data
}

// DELETE /payment-type/bulk-delete
export const deleteManyPaymentTypes = async (ids: TEntityId[]) => {
    const endpoint = `/payment-type/bulk-delete`
    await APIService.delete<void>(endpoint, { ids })
}
